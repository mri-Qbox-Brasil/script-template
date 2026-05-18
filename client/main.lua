-- Main client script
AddEventHandler("onResourceStart", function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then
        return
    end
    if Config.Debug then
        print("Recurso " .. resourceName .. " iniciado com sucesso.")
    end
end)
