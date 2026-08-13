fx_version "cerulean"
game "gta5"

lua54 "yes"

author "MRI Qbox Team"
description "Novo recurso baseado no MRI Template"
version "__VERSION__"

client_scripts {
    "client/*.lua"
}

server_scripts {
    "@oxmysql/lib/MySQL.lua",
    "server/*.lua"
}

shared_scripts {
    "shared/*.lua"
}

dependencies {
    "oxmysql"
}
