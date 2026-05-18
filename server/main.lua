-- Boot do plugin. Registra com o mri_Qadmin via export (fail-silent se
-- Qadmin nao tiver) e mantem o NUI command standalone funcionando sempre.

local HEX_PATTERN = '^#%x%x%x%x%x%x$'

local function isValidHex(value)
    return type(value) == 'string' and value:match(HEX_PATTERN) ~= nil
end

local function resolveAccentColor()
    local convar = GetConvar('mri:color', '')
    if isValidHex(convar) then return convar end
    return '#00E699'
end

AddConvarChangeListener('mri:color', function(name)
    if name ~= 'mri:color' then return end
    TriggerClientEvent('plugintest:client:accentColorChanged', -1, resolveAccentColor())
end)

CreateThread(function()
    local deadline = GetGameTimer() + 10000
    while GetResourceState('mri_Qadmin') ~= 'started' and GetGameTimer() < deadline do
        Wait(200)
    end
    if GetResourceState('mri_Qadmin') ~= 'started' then return end

    local ok, result = pcall(function()
        return exports['mri_Qadmin']:RegisterPlugin({
            id = 'plugintest',
            label = 'Plugin Test',
            icon = 'box',
            resource = GetCurrentResourceName(),
            htmlPath = 'html/index.html',
            requiredPerms = { 'plugintest.admin', 'command' },
            description = 'Plugin de exemplo / template base',
        })
    end)
    if not ok or result == false then
        print('[plugintest] ' .. locale('plugin.register_failed', tostring(result)))
    end
end)
