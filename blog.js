var app = angular.module('Blog', ['ngRoute']);

app.config(['$routeProvider', function config($routeProvider) {
  $routeProvider.
  when('/posts/page/:page_id', {
    templateUrl: 'pages/posts/home.html',
    controller: "PostsController"
  }).
  when('/posts/:id', {
    templateUrl: 'pages/posts/show.html',
    controller: "PostController"
  }).
  when('/create/post', {
    templateUrl: 'pages/posts/edit.html',
    controller: "PostsController"
  }).
  when('/posts/:id/edit', {
      templateUrl: 'pages/posts/edit.html',
      controller: "PostController"
    })
    .
  when('/posts/:id/comments/:comment_id/edit', {
    templateUrl: 'pages/posts/edit_comment.html',
    controller: "PostController"
  }).
  when('/posts/:id/tags', {
    templateUrl: 'pages/posts/edit_tags.html',
    controller: "PostController"
  }).
  when('/sobre', {
    templateUrl: 'pages/static_pages/about.html',
    controller: "PostsController"
  }).
  when('/contato', {
    templateUrl: 'pages/static_pages/contact.html',
    controller: "PostsController"
  }).
  when('/login', {
    templateUrl: 'pages/user-account/log-in.html',
    controller: "PostsController"
  }).
  when('/signup', {
    templateUrl: 'pages/user-account/sign-up.html',
    controller: "PostsController"
  }).
  when('/show-user', {
    templateUrl: 'pages/user-account/my-account.html',
    controller: "PostsController"
  }).
  when('/edit-user', {
    templateUrl: 'pages/user-account/edit_user.html',
    controller: "PostsController"
  }).
  when('/add-tag', {
    templateUrl: 'pages/add-tag.html',
    controller: "PostController"
  }).otherwise({
    redirectTo: '/posts/page/1',
    controller: "PostsController"
  });
}]);


// Controller da Aplicação, lida principalmente com o User
app.controller('AplicationController', ['$scope', 'userService', '$location', function ($scope, userService, $location) {


  // Método para Login
  $scope.login = function (user) {
    userService.getUser(user.email, user.password).then(function (response) {
      if (response.error) {
        $('.error-message').show().text("Login inválido");
        $location.url('/login');
      } else {
        localStorage.setItem("user_id", response.user.id)
        localStorage.setItem("user_name", response.user.name)
        localStorage.setItem("user_email", response.user.email)
        localStorage.setItem("token", response.token)
        $('.message').show().text("Bem vindo!");
        $location.url('/posts');
        $window.location.reload();

      }
    })


  };

  // Método para SignUp
  $scope.signup = function (user) {

    if (user.password != user.password_confirm){
      $('.error-message').show().text("Senhas incompativeis!");
      setTimeout(() => { $window.location.reload(); }, 500);
    }
    else{

      userService.createUser(user.name, user.email, user.password).then(function (response) {
        if (response.error) {
          $('.error-message').show().text(response.error);
          $location.url('/login');
        } else {
          localStorage.setItem("user_id", response.user.id)
          localStorage.setItem("user_name", response.user.name)
          localStorage.setItem("user_email", response.user.email)
          localStorage.setItem("token", response.token)
          $('.message').show().text("Bem vindo!");
          $location.url('/posts');
          $window.location.reload();
  
        }
      })

    }

  };

  // Editar usuário
  $scope.editUser = function (user_id, name, email, password) {
    if(password.length < 6){
      $('.message').show().text("Senha muito curta!");
    }else{
      userService.updateUser(user_id, name, email, password).then(function (response) {
        $scope.editedUser = response;
        localStorage.setItem("user_name", name)
        localStorage.setItem("user_email", email)
      })
      $('.message').show().text("User editado!");
      $location.url('/show-user');
    }
    
  };

  // User paths
  $scope.loginPath = function () {
    $location.url('/login');
  };

  $scope.signupPath = function () {
    $location.url('/signup');
  };

  $scope.showAccount = function () {
    $location.url('/show-user');
  };

  $scope.editUserPath = function (name, email) {
    $scope.email = email
    $scope.name = name
    $location.url('/edit-user');
  };

  // Método para logout
  $scope.logout = function () {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('token');
    $('.message').show().text("User deslogado!");

    $location.url('/login');
  };

  // Destrói o usuário
  $scope.destroyUser = function (user_id) {
    userService.deleteUser(user_id).then(function (response) {
      $scope.deletedUser = response;
    })
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('token');
    $location.url('/login');
    $('.message').show().text("User apagado!");
  };

  // Testa se o usuario está logado
  $scope.is_logged = function () {
    return !!localStorage.getItem('user_email');
  };

  // Pega dados do usuário
  $scope.logged_user_email = function () {
    return localStorage.getItem('user_email');
  };

  $scope.logged_user_name = function () {
    return localStorage.getItem('user_name');
  };

  $scope.logged_user_id = function () {
    return localStorage.getItem('user_id');
  };

}]);

app.controller('PostsController', ['$scope', 'postService', '$location', '$routeParams', '$window', 'commentService', 'tagService', function ($scope, postService, $location, $routeParams, $window, commentService, tagService) {

  // Pega todos os posts
  if ($routeParams.page_id) {
    postService.getAll($routeParams.page_id).then(function (response) {
      $scope.posts = response;
    })
  }
  

  //Tags
  $scope.editTags = function (post_id) {
    $location.url('/posts/' + post_id + '/tags');
  };

  //Posts
  $scope.openPost = function (post_id) {
    $location.url(`posts/` + post_id);
  };

  $scope.atualizePost = function (post) {
    $location.url(`posts/` + post_id);
  };

  $scope.deletePost = function (post_id) {
    postService.deleteOne(post_id).then(function (response) {
      $scope.deletePost = response;
    })
    $('.message').show().text("Post deletado!");
    setTimeout(() => { $window.location.reload(); }, 500);
  };

  $scope.createPost = function () {
    $location.url('/create/post');
  };

  $scope.seePosts = function (page_id) {
    $location.url('/posts/page/' + page_id);
  };

  $scope.updatePost = function (post_id) {
    $location.url('posts/' + post_id + '/edit');
  };

  $scope.changePost = function (post) {
    if (!post.title || !post.description) {
      $('.error-message').show().text("Campos não aceitos!");
      $location.url(`create/post`);
    } else if (post.description.length < 10) {
      $('.error-message').show().text("Descrição muito curta!");
      $location.url(`create/post`);

    } else {
      if (post.id) {
        postService.updateOne(post).then(function (response) {
          $scope.updatePost = response;
        })
        $('.message').show().text("Post alterado!");
        $location.url(`posts/`);
      } else {
        postService.createOne(post).then(function (response) {
          $scope.createPost = response;
        })
        $('.message').show().text("Post criado!");
        $location.url(`posts/`);
      }
    }


  };

  //Paginação
  $scope.nextPage = function () {
    let pageCount = parseInt($routeParams.page_id) + 1
    $location.url('/posts/page/' + pageCount);
    scroll(0,0)
  };

  $scope.previousPage = function () {
    let pageCount = 0
    if(parseInt($routeParams.page_id) - 1 > 0){
       pageCount = parseInt($routeParams.page_id) - 1
    }
    else {
       pageCount = parseInt($routeParams.page_id)
    }
    $location.url('/posts/page/' + pageCount);
    scroll(0,0)
  };

  //Comentários 
  $scope.createComment = function (comment) {
    commentService.addComment($scope.post.id, comment).then(function (response) {
      $scope.newComment = response;
    });
  };

  $scope.destroyComment = function (post_id, comment_id) {
    commentService.deleteComment(post_id, comment_id).then(function (response) {
      $scope.deleteComment = response;
    })
    $('.message').show().text("Comentário Deletado!");
    setTimeout(() => { $window.location.reload(); }, 500);
  };

  $scope.editComment = function (post_id, comment_id) {
    $location.url('/posts/' + post_id + '/comments/' + comment_id + '/edit');
  };

  $scope.changeComment = function (post_id, comment) {
    commentService.editComment(post_id, comment).then(function (response) {
      $scope.editedComment = response;
    })
    $('.message').show().text("Comentário Editado!");

    $location.url(`posts/` + post_id);
  };

}]);

app.controller('PostController', ['$scope', 'postService', '$location', '$routeParams', '$window', 'commentService', 'tagService', function ($scope, postService, $location, $routeParams, $window, commentService, tagService) {

  if ($routeParams.id) {
    postService.getOne($routeParams.id).then(function (response) {
      $scope.post = response;
    })
  }

  if ($routeParams.comment_id) {
    commentService.getComment($routeParams.id, $routeParams.comment_id).then(function (response) {
      $scope.comment = response;
    })
  }

  $scope.newComment = {
    'text': ''
  }

  //Tags
  $scope.editTags = function (post_id) {
    $location.url('/posts/' + post_id + '/tags');
  };

  $scope.addTags = function () {
    $location.url('/add-tag');
  };

  $scope.deleteTag = function (post_id, tag_id) {
    postService.unlinkTag(post_id, tag_id).then(function (response) {
      $scope.delTag = response;
    })

    $('.message').show().text("Tag Deletada!");
    setTimeout(() => { $window.location.reload(); }, 500);
  };

  tagService.getTags().then(function (response) {
    $scope.tags = response;
  });

  $scope.newTag = function (tagName) {
    tagService.createTag(tagName).then(function (response) {
      $scope.createdTag = response;
    })
    $window.location.reload();
  };

  $scope.addTag = function (newTag, post_id) {
    if (newTag.id) {
      newTag.id = newTag.id.split(" ");
      newTag.id = newTag.id[0]
      postService.linkTag(post_id, newTag.id).then(function (response) {
        $scope.addTag = response;
      })

    }
    $('.message').show().text("Tag Adicionada!");
    setTimeout(() => { $window.location.reload(); }, 500);

  };

  //Posts
  $scope.openPost = function (post_id) {
    $location.url(`posts/` + post_id);
  };

  $scope.atualizePost = function (post) {
    $location.url(`posts/` + post_id);
  };

  $scope.deletePost = function (post_id) {
    postService.deleteOne(post_id).then(function (response) {
      $scope.deletePost = response;
    })
    $('.message').show().text("Post deletado!");
    setTimeout(() => { $window.location.reload(); }, 500);

  };

  $scope.changePost = function (post) {
    if (post.id) {
      postService.updateOne(post).then(function (response) {
        $scope.updatePost = response;
      })
      $('.message').show().text("Post editado!");

      $location.url(`posts/`);
    } else {
      postService.createOne(post).then(function (response) {
        $scope.createPost = response;
      })
      $('.message').show().text("Post criado!");

      $location.url(`posts/`);
    }

  };

  // Rotas de Posts
  $scope.createPost = function () {
    $location.url('/create/post');
  };

  $scope.seePosts = function (page_id) {
    $location.url('/posts/page/' + page_id);
  };

  $scope.updatePost = function (post_id) {
    $location.url('posts/' + post_id + '/edit');
  };

  //Relativos a comentários
  $scope.createComment = function (comment) {
    if( comment.text.length < 5 ){
      $('.error-message').show().text("Comentário muito curto!");
      setTimeout(() => { $window.location.reload(); }, 500);
    }else{
      commentService.addComment($scope.post.id, comment).then(function (response) {
        $scope.newComment = response;
      });
      $('.message').show().text("Comentário adicionado!");
      setTimeout(() => { $window.location.reload(); }, 500);
    }
    
  };

  $scope.destroyComment = function (post_id, comment_id) {
    commentService.deleteComment(post_id, comment_id).then(function (response) {
      $scope.deleteComment = response;
    })
    $window.location.reload();
  };

  $scope.editComment = function (post_id, comment_id) {
    $location.url('/posts/' + post_id + '/comments/' + comment_id + '/edit');
  };

  $scope.changeComment = function (post_id, comment) {
    commentService.editComment(post_id, comment).then(function (response) {
      $scope.editedComment = response;
      $location.url('posts/' + post_id);

    })
  };

}]);



// Funções relativas as requisições de Post
app.service('postService', function ($http) {

  //Pega um post
  const getOne = (post_id) => $http.get(`http://localhost:3000/posts/${post_id}.json`, {
    headers: {
      'Authorization': localStorage.getItem('token')
    }
  }).then((response) => response.data)

  //Pega todos os posts da página
  const getAll = (page_id) => $http.get(`http://localhost:3000/posts.json?page=${page_id}`).then((response) => response.data)

  const deleteOne = (post_id) => $http.delete(`http://localhost:3000/posts/${post_id}.json`, {
    headers: {
      'Authorization': localStorage.getItem('token')
    }
  }).then((response) => response.data)

  // Deslinka tag a um post
  const unlinkTag = (post_id, tag_id) => $http({
    method: 'DELETE',
    url: `http://localhost:3000/posts/${post_id}/tag.json`,
    data: {
      "post": {
        "tag_id": tag_id
      }
    },
    headers: {
      'Authorization': localStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  }).then((response) => response.data)

  // Linka tag a um post
  const linkTag = (post_id, tag_id) => $http({
    method: 'POST',
    url: `http://localhost:3000/posts/${post_id}/tag.json`,
    data: {
      "post": {
        "tag_id": tag_id
      }
    },
    headers: {
      'Authorization': localStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  }).then((response) => response.data)

  const createOne = (new_post) => $http({
    method: 'POST',
    url: `http://localhost:3000/posts.json`,
    data: new_post,
    headers: {
      'Authorization': localStorage.getItem('token'),
    }
  }).then((response) => response.data)

  // Atualiza um Post
  const updateOne = (post) => $http({
    method: 'PUT',
    url: `http://localhost:3000/posts/${post.id}.json`,
    data: post,
    headers: {
      'Authorization': localStorage.getItem('token')
    }
  }).then((response) => response.data)

  return {
    getOne,
    getAll,
    deleteOne,
    unlinkTag,
    linkTag,
    createOne,
    updateOne
  }
});

// Funções relativas as requisições de Usuário
app.service('userService', function ($http) {

  const getUser = (email, password) => $http({
    method: 'POST',
    url: `http://localhost:3000/users/login.json`,
    data: {
      "user": {
        "email": email,
        "password": password
      }
    }
  }).then((response) => response.data)

  const createUser = (name, email, password) => $http({
    method: 'POST',
    url: `http://localhost:3000/users.json`,
    data: {
      "user": {
        "name": name,
        "email": email,
        "password": password
      }
    }
  }).then((response) => response.data)

  const deleteUser = (user_id) => $http({
    method: 'DELETE',
    url: `http://localhost:3000/users/${user_id}.json`,
    headers: {
      'Authorization': localStorage.getItem('token')
    }
  }).then((response) => response.data)

  const updateUser = (user_id, name, email, password) => $http({
    method: 'PUT',
    url: `http://localhost:3000/users/${user_id}.json`,
    data: {
      "user": {
        "name": name,
        "email": email,
        "password": password
      }
    },
    headers: {
      'Authorization': localStorage.getItem('token')
    }
  }).then((response) => response.data)

  return {
    getUser,
    createUser,
    deleteUser,
    updateUser
  }
});

// Funções relativas as requisições de Comentário
app.service('commentService', function ($http) {

  const getComment = (post_id, comment_id) =>
    $http.get(`http://localhost:3000/posts/${post_id}/comments/${comment_id}.json`, {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    }).then((response) => response.data)

  const addComment = (post_id, newComment) => $http({
    method: 'POST',
    url: `http://localhost:3000/posts/${post_id}/comments.json`,
    data: newComment,
    headers: {
      'Authorization': localStorage.getItem('token')
    }
  }).then((response) => response.data)

  const deleteComment = (post_id, comment_id) => $http({
    method: 'DELETE',
    url: `http://localhost:3000/posts/${post_id}/comments/${comment_id}.json`,
    headers: {
      'Authorization': localStorage.getItem('token')
    }
  }).then((response) => response.data)

  const editComment = (post_id, comment) => $http({
    method: 'PUT',
    url: `http://localhost:3000/posts/${post_id}/comments/${comment.id}.json`,
    data: comment,
    headers: {
      'Authorization': localStorage.getItem('token')
    }
  }).then((response) => response.data)

  return {
    getComment,
    addComment,
    deleteComment,
    editComment
  }
});

// Funções relativas as requisições de Tag
app.service('tagService', function ($http) {

  const getTags = () => $http({
    method: 'GET',
    url: `http://localhost:3000/tags.json`,
    headers: {
      'Authorization': localStorage.getItem('token')
    }
  }).then((response) => response.data)

  const createTag = (tagName) => $http({
    method: 'POST',
    url: `http://localhost:3000/tags.json`,
    data: {
      "tag": {"name": tagName}
    },
    headers: {
      'Authorization': localStorage.getItem('token')
    }
  }).then((response) => response.data)

  return {
    getTags, createTag
  }
});