-- Verifica/cria as tabelas do recurso a partir do database.sql na raiz.
-- O arquivo é opcional: sem database.sql (ou sem oxmysql) o boot segue normal.

local SQL_FILE = "database.sql"

--- Só imprime nível não-erro quando Config.Debug está ligado.
local function log(level, message)
    if level ~= "error" and not (Config and Config.Debug) then
        return
    end
    print(("[%s] [db] %s"):format(GetCurrentResourceName(), message))
end

local function splitStr(inputstr, sep)
    if sep == nil then
        sep = "%s"
    end
    local t = {}
    for str in string.gmatch(inputstr, "([^" .. sep .. "]+)") do
        str = string.gsub(str, "^%s*(.-)%s*$", "%1")
        if not (str == nil or str == "") then
            table.insert(t, str)
        end
    end
    return t
end

--- Remove comentários de linha (-- ...) antes do split por ';'.
--- O split é ingênuo: um ';' escrito DENTRO de um comentário parte a instrução seguinte ao
--- meio, e o CREATE TABLE afetado nunca roda — falha silenciosa, porque executeQueries usa
--- pcall e o boot segue como se nada tivesse acontecido.
local function stripSqlComments(sql)
    return (sql:gsub("%-%-[^\n]*", ""))
end

local function executeQueries(queries)
    for index, query in ipairs(queries) do
        local ok, err = pcall(MySQL.query.await, query)
        if ok then
            log("debug", "Tabela verificada/criada: " .. index)
        else
            log("error", "query " .. index .. " falhou: " .. tostring(err))
        end
    end
end

local function createTables()
    local sql = LoadResourceFile(GetCurrentResourceName(), SQL_FILE)
    if not sql or sql == "" then
        log("debug", SQL_FILE .. " não encontrado; nenhuma tabela a criar.")
        return
    end

    if not MySQL then
        log("error", "oxmysql não carregado; " .. SQL_FILE .. " foi ignorado.")
        return
    end

    log("debug", "Verificando/criando tabelas...")
    executeQueries(splitStr(stripSqlComments(sql), ";"))
    log("debug", "Todas as tabelas foram verificadas/criadas.")
    TriggerEvent(GetCurrentResourceName() .. ":db:ready")
end

CreateThread(createTables)
