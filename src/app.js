const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
//array de repositórios

app.get("/repositories", (request, response) => {

    return response.json(repositories);
  //estou pegando os repositories e listando
 
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  //recebemos title, url, techs de dentro do corpo da requisição
  

  //Ao cadastrar um novo projeto, ele deve ser armazenado dentro de um objeto no seguinte formato:
  const repository = {
  //utilizamos a função uuid para fazer um unique universal id 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0,
  }

  repositories.push(repository);
  //com o metodo .push, adicionamos um novo repositório ao array de repositórios

  return response.json(repository);
  //retornamos em JSON o repositório criado
});

app.put("/repositories/:id", (request, response) => {


  const { id } = request.params;
  //armazeno o id dos pâmetros da url (parâmetros da rota)

  const { title, url, techs } = request.body;

  //armazeno o title, url, techs do corpo da requisição (request.body)

  const findRepositoryIndex = repositories.findIndex(repository => repository.id === id);
  //procurar qual é a posição no array onde está esse repositório
  //repository => repository.id === id -> para cada um dos repositórios, procurar aquele que o repository.id
  //seja === ao id que estou recebendo aqui em cima na url (parâmetros da rota). 
 
  if (findRepositoryIndex === -1){
      return response.status(400).json({error : "Repository does not exists"})
  // se não existe (se for === a -1), retorna o status 400;
  }

  const repository = {
      id,
      title, 
      url,
      techs,
      likes: repositories[findRepositoryIndex].likes,
  
  };
  // armazeno o objeto {title, url, techs} quem vem do corpo da requisição dentro da váriavel repository

  repositories[findRepositoryIndex] = repository;
  //atualizo o array repositories com a váriavel repository

  return response.json(repository);

});



app.delete("/repositories/:id", (request, response) => {

 const {id} = request.params;

 const findRepositoryIndex = repositories.findIndex(repository => repository.id === id);
 //procurar qual é a posição no array onde está esse repositório
 //repository => repository.id === id -> para cada um dos repositórios, vou procurar aquele que o repository.id
 //seja === ao id que estou recebendo aqui em cima. 


 
 if(findRepositoryIndex >= 0){
    //este if verifica se o repositório existe
   //findIndex retorna -1 quando não encontra
   repositories.splice(findRepositoryIndex, 1);
   //se ele encontrar, ele vai executar um .splice pra remover 1 posição
 }else{
  //se não existe, retorna o status 400
  return response.status(400).json({error : "Repository does not exists"});
 }

 return response.status(204).send();
  //ao fazer a exclusão, retorna uma resposta vazia, com status 204

});

app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(repository => repository.id === id);

   
  if (findRepositoryIndex === -1){
    return response.status(400).json({error : "Repository does not exists"})
// se não existe (se for === a -1), retorna o status 400;
}

  repositories[findRepositoryIndex].likes++; //ou += 1

  return response.json(repositories[findRepositoryIndex]);

});

module.exports = app;
