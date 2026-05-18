-- Persiste settings da aba Configuracoes em data/config.json.

local CONFIG_FILE = 'data/config.json'

local DEFAULTS = {
    debug = false,
    welcomeMessage = 'Hello, Plugin Test!',
}

local config = {}

local function applyDefaults(input)
    local out = {}
    for k, v in pairs(DEFAULTS) do
        if input[k] ~= nil then
            out[k] = input[k]
        else
            out[k] = v
        end
    end
    return out
end

local function loadFromDisk()
    local raw = LoadResourceFile(GetCurrentResourceName(), CONFIG_FILE)
    if not raw or raw == '' then
        config = applyDefaults({})
        return
    end
    local ok, parsed = pcall(json.decode, raw)
    config = applyDefaults((ok and type(parsed) == 'table') and parsed or {})
end

local function saveToDisk()
    local ok = SaveResourceFile(
        GetCurrentResourceName(),
        CONFIG_FILE,
        json.encode(config, { indent = true }),
        -1
    )
    if not ok then
        print('[' .. GetCurrentResourceName() .. '] ' .. locale('plugin.file_write_failed', CONFIG_FILE))
    end
    return ok
end

local function isAdmin(source)
    return IsPlayerAceAllowed(source, 'plugintest.admin')
        or IsPlayerAceAllowed(source, 'command')
end

loadFromDisk()

function GetPluginConfig()
    return config
end

lib.callback.register('plugintest:server:getConfig', function()
    return config
end)

lib.callback.register('plugintest:server:saveConfig', function(source, payload)
    if not isAdmin(source) then return false, locale('plugin.no_permission') end
    if type(payload) ~= 'table' then return false, locale('plugin.invalid_payload') end

    config = applyDefaults(payload)
    if not saveToDisk() then return false, locale('plugin.config_save_failed') end

    TriggerClientEvent('plugintest:client:configChanged', -1, config)
    return true, config
end)
