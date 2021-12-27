//back-end
//npm = node package manager
//gerenciador de dependências do node
//com o npm consegue iniciar congiruções boas
//para usar o node de maneira mais integrada

//o http post envia os dados de uma maneira mais escondida (sem aparecer no http da página)
//post é usado para tratar dados sensíveis, ou seja, que não podem aparecer no http da página. Ex: cpf, rg...

const express = require("express")
const server = express()

//pegar o banco de dados
const db = require("./database/db")

//configurar pasta pública
//configuração específica do servidor (tem várias)
server.use(express.static("public"))

//habilitar o uso do req.body na aplicação
//server.use(express.urlencoded( {extended:true} ))

//Utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    //Cache = salvando algo na memória para devolver mais rápido
    //noCache = não use cache
    noCache: true
})

//configurar caminhos da aplicação
//página inicial
//Get = verbo http
//req = requisição (um pedido)
//res: resposta

//configuração de rota do servidor
server.get("/", (req, res) => {
     return res.render("index.html", { title: "Um Título"})
})

server.get("/create-point", (req, res) => {

    //req.query = trabalha com as Query Strings da url
    //ou seja, nome, interrogação, etc. Tudo que aparece no http da página
    //console.log(req.query)

    return res.render("create-point.html",)
})

server.post("/savepoint", (req, res) => {
    
    //console.log(req.query)

    //req.body: corpo do formulário
    //por padrão, o servidor não está habilitado a receber o body
    //console.log(req.body)

    //inserir dados no banco de dados
    //2 - Inserir dados na tabela

    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.send("Erro no cadastro")
        }
        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", {saved: true})
    }

    //callback = chame de volta (terceiro elemento do db.run abaixo)
    db.run(query, values, afterInsertData)
    
})

server.get("/search", (req, res) => {
    const search = req.query.search
    if(search == ""){
        //pesquisa vazia
        return res.render("search-results.html", { total: 0 })
    }

    //pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if(err) {
            return console.log(err)
        }

        //console.log(rows)
        const total = rows.length

        //console.log("Aqui estão os seus registros: ")
        //console.log(rows)
        //mostrar a página html com os dados do banco de dados
        return res.render("search-results.html", {places: rows, total: total})

    })

})

//o console.log no back-end sempre será apresentado no terminal do visual studio code
//ligando o servidor
server.listen(3000)
