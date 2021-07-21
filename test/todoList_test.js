const { assert } = require('chai');

const TodoList = artifacts.require("TodoList");

require('chai')
.use(require('chai-as-promised'))
.should()

contract('TodoList', (accounts) => {

    let todoList

    before(async() => {
        todoList = await TodoList.deployed()
    })

    describe('deployment', async () =>{
        it('deploys successfully', async() => {
            const address = todoList.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has correct number of tasks initially ', async() => {
            const taskCount = await todoList.taskCount()
            const expected = 2
            assert.equal(taskCount.toString(), expected)
        })

        it('has correct task 1', async() => {
            const task1 = await todoList.tasks(1)
            assert.equal(task1[0].toString(), 1)
            assert.equal(task1[1], 'read a book')
            assert.equal(task1[2], false)
        })

        it('has correct task 2', async() => {
            const task2 = await todoList.tasks(2)
            assert.equal(task2[0].toString(), 2)
            assert.equal(task2[1], 'go to gym')
            assert.equal(task2[2], false)
        })
    })

    describe('create task', async() => {
        it('creates task 3 successfully', async() => {
            await todoList.createTask('take a nap')
            const task3 = await todoList.tasks(3)
            assert.equal(task3[0].toString(), 3)
            assert.equal(task3[1], 'take a nap')
            assert.equal(task3[2], false)
        })

        it('cannot create existing tasks again', async() => {
            await todoList.createTask('read a book').should.be.rejected
            await todoList.createTask('go to gym').should.be.rejected
            await todoList.createTask('take a nap').should.be.rejected
        })
    })

    describe('toggle a task', async() => {
        it('can toggle task 1, false to true', async () => {
            await todoList.toggleCompleted(1)
            const task1 = await todoList.tasks(1) 
            assert.equal(task1[0].toString(), 1)
            assert.equal(task1[1], 'read a book')
            assert.equal(task1[2], true)
            // console.log(task1[0].toString())
            // console.log(task1[1])
            // console.log(task1[2])
        })

        it('can toggle task 1 again, true to false', async () => {
            await todoList.toggleCompleted(1)
            const task1 = await todoList.tasks(1)
            assert.equal(task1[0].toString(), 1)
            assert.equal(task1[1], 'read a book')
            assert.equal(task1[2], false) 
            // console.log(task1[0].toString())
            // console.log(task1[1])
            // console.log(task1[2])
        })     
    })



})