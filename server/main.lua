-- Main server script
AddEventHandler("onResourceStart", function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then
        return
    end
    print("Recurso " .. resourceName .. " iniciado com sucesso.")
end)
