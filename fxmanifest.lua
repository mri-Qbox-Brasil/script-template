fx_version "cerulean"
game "gta5"

lua54 "yes"

author "MRI Qbox Team"
description "Novo recurso baseado no MRI Template"
version "__VERSION__"

-- Scripts de Cliente
client_scripts {
    "client/*.lua"
}

-- Scripts de Servidor
server_scripts {
    "server/*.lua"
}

-- Interface (NUI)
ui_page "web/build/index.html"

files {
    "web/build/**",
}
