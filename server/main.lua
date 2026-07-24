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

local function doRegister()
    if GetResourceState('mri_Qadmin') ~= 'started' then return end
    exports['mri_Qadmin']:RegisterPlugin({
        id = 'plugintest',
        label = 'Plugin Test',
        icon = 'box',
        resource = GetCurrentResourceName(),
        htmlPath = 'html/index.html',
        requiredPerms = { 'plugintest.admin', 'command' },
        description = 'Plugin de exemplo / template base',
    })
end

-- Qadmin inicia/reinicia → re-registra automaticamente
AddEventHandler('onServerResourceStart', function(resourceName)
    if resourceName == 'mri_Qadmin' then doRegister() end
end)

-- Plugin inicia com Qadmin já rodando → registra imediatamente
CreateThread(function()
    Wait(0)
    doRegister()
end)
