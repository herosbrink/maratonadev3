// Configurando servidor
const express = require("express")
const server = express()

//Configurar servidor para apresentar arquivos estáticos - css. pngs js etc...
server.use(express.static('public'))

// Habilitar o body do formulário
server.use(express.urlencoded({extended: true}))

// Configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '11235813',
    host: 'localhost',
    port: 5432,
    database: 'Doe'
})

//Configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})






// Configurar apresentação da página
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html", {donors})

    })

})

// Pegar dados do formulário
server.post("/", function (req, res){
   const name = req.body.name
   const email = req.body.email
   const blood = req.body.blood

// Usando if para garantir que o BD receba todas as informações solicitadas.   
if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios.")
}


// Colocando valores novos dentro do banco de dados via formulário.
   const query = 'insert into donors("name","email","blood") values($1, $2, $3)'
   const values = [name, email, blood]

   
   db.query(query, values, function(err){
    // fluxo de erro   
    if (err) return res.send("erro no banco de dados.")
    // fluxo ideal   
   return res.redirect("/")
           
       })

})

// ligar o servidor e permitir acesso na porta 3000
server.listen(3000, function(){
    console.log("Iniciei o servidor!")
})