# Task App
    A mini project with test suits created to manage your own tasks.

# Goal
    Create task and defined as a complete or incomplete linked to its own user. Plus manage your own profile picture.

> ## Routes
### **User**
    /users
        - get
        - post
    /users/:id
        - get
        - patch
        - delete
    /users/:id/avatar
        - post
        - delete
        - get
    /users/login
        - post
    /users/logout
        - post
    /users/logoutAll
        - post
    /users/remove/me
        - delete

### **Task**
    /tasks
        - post
        - get
    /tasks/:id
        - get
        - patch
        - delete

> ## Get started

You have on _settings.js_ an object with different configurations based on the environment. By the moment all are locally but if you have a database based in the cloud you can use it.

* To start the API:

        npm i
        npm start env (env is the script in your package.json) ex: dev

Example: **npm start dev**

> ## Tests
    * npm start test -> Run all tests

***You will watch on the terminal the details from tests, by default its connected locally and create a database for the tests***

> ## WorkFlow
    A. You can register as a User
    B. Create your avatar
    C. Create your task and manage it