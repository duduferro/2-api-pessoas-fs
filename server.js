import express from 'express';
import { v4 as uuidv4} from 'uuid';
import cors from 'cors'

const app = express()
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

const pessoas_1 = []
const PORT = 3333
app.use(express.json())



app.get('/pessoas/', (req, res) => {
    res.status(200).json(pessoas_1)
})

app.post('/pessoas/', (req, res) => {
    
    const {nome,email,senha,link_img} = req.body;
    console.log(nome, email,senha,link_img)

    if(!nome){
        res.status(400).json({mensagem: 'Nome é obrigatório'})
        return
    }

    if(!email){
        res.status(400).json({mensagem: 'Email é obrigatório'})
        return
    }

    if(!senha){
        res.status(400).json({mensagem: 'Senha é obrigatória'})
        return
    }

    if(!link_img){
        res.status(400).json({mensagem: 'Imagem é obrigatória'})
        return
    }

    const pessoa = {
        id: uuidv4(),
        nome,
        email,
        senha,
        link_img                
    }

    const emailExistente = pessoas_1.find((pessoa) => pessoa.email === email)
    if (emailExistente) {
        res.status(400).json({ mensagem: 'Email já está em uso' })
        return
    }
    
    pessoas_1.push(pessoa)
    res.status(201).json({mensagem: "Cadastro realizado com sucesso", pessoa})
    res.status(200).json({rota: 'POST /pessoas'})
})

app.get('/pessoas/:id', (req, res) => {
    const {id} = req.params;

    const encontrarPessoa = pessoas_1.findIndex( (obj) => obj.id === id)
    if(encontrarPessoa === -1){
        res.status(404).json({mensagem: 'Pessoa desaparecida!'})
        return
    }

    const pessoa = pessoas_1[encontrarPessoa]
    res.status(200).json({mensagem: 'Pessoa encontrada', pessoa});
})


app.put('/pessoas/:id', (req, res) => {
    const {id} = req.params;
    const {nome, email,senha,link_img} = req.body;

    const encontrarPessoa = pessoas_1.findIndex( (obj) => obj.id === id)
    if(encontrarPessoa === -1){
        res.status(404).json({mensagem: 'Pessoa desaparecida!'})
        return
    }

    if(!nome || !email || !senha || !link_img){
        res.status(400).json({mensagem: 'Nome, email, senha e imagem obrigatórios'})
        return
    }

    const emailExistente = pessoas_1.find((pessoa) => pessoa.email === email)
    if (emailExistente) {
        res.status(400).json({ mensagem: 'Email já está em uso' })
        return
    }

    const pessoaAtualizada = {
        id,
        nome,
        email,
        senha,
        link_img
    }

    pessoas_1[encontrarPessoa] = pessoaAtualizada

    res.status(200).json({mensagem: 'Pessoa mudada!', pessoaAtualizada})
})

app.post('/login', (req, res) => {
    const { email, senha } = req.body

    if (!email || !senha) {
        res.status(400).json({ mensagem: 'Email e senha são obrigatórios' })
        return
    }

    const usuario = pessoas_1.find((pessoa) => pessoa.email === email && pessoa.senha === senha);

    if (!usuario) {
        res.status(401).json({ mensagem: 'Credenciais inválidas' });
        return
    }
    
    res.status(200).json({ mensagem: 'Login realizado com sucesso', usuario})
})

app.delete('/pessoas/:id', (req, res) => {
    const {id} = req.params;

    const encontrarPessoa = pessoas_1.findIndex( (obj) => obj.id === id)
    if(encontrarPessoa === -1){
        res.status(404).json({mensagem: 'Pessoa desaparecida!'})
        return
    }

    pessoas_1.splice(encontrarPessoa)
    res.status(200).json({mensagem:'Usuário excluído da existencia!'})
})

app.listen(PORT, () => {
    console.log('Servidor iniciado na PORTA: ', PORT)})