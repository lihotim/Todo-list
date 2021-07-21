import React, { Component } from 'react';
import Web3 from 'web3'
import icon from '../todo.png';
import TodoList from '../abis/TodoList.json'
import './App.css';

class App extends Component {

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {

    const web3 = window.web3

    //load accounts, fetch account's ETH balance
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    // fetch the '5777' value
    const networdId = await web3.eth.net.getId()

    // Load TodoList smart contract
    const networkData = TodoList.networks[networdId]
    if(networkData){
      const todoList = new web3.eth.Contract(TodoList.abi, networkData.address)
      this.setState({ todoList })

      const taskCount = await todoList.methods.taskCount().call()
      this.setState({ taskCount: taskCount.toString() })
      
      // Fetch all existing tasks
      for(let i=1; i<=taskCount.toString(); i++){
        const tasks = await todoList.methods.tasks(i).call()
        this.setState({ tasks: [...this.state.tasks, tasks] })
        // console.log(tasks)
      }
      // console.log(this.state.tasks[0].id.toString(), this.state.tasks[0].content, this.state.tasks[0].isCompleted)
      // console.log(this.state.tasks[1].id.toString(), this.state.tasks[1].content, this.state.tasks[1].isCompleted)

    }else{
      window.alert('TodoList contract not deployed to detected network.')
    }

    this.setState({loading:false})
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      account:'',
      todoList: {},
      taskCount: 0,
      tasks: [],
    };
  }

  createTask (content) {
    this.setState({ loading: true })
    this.state.todoList.methods.createTask(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  toggleCompleted (id) {
    this.setState({ loading: true })
    this.state.todoList.methods.toggleCompleted(id).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  render() {

    let content
    
    if(this.state.loading){
      content = <p id="loader" className="text-center"> Loading... </p>
    } else {
      content = 
      <div className="content mr-auto ml-auto">
      <a
        href="http://google.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={icon} className="App-logo" alt="logo" width="200"/>
      </a>
      <h1>My Todo List</h1>

      <form onSubmit={(event) => {
          event.preventDefault()
          let input
          input = this.input.value
          this.createTask(input)
        }}>

          <input id="inputTask"
              type="text" 
              placeholder="Input a task..."
              ref={(input) => { this.input = input }}
          />
        <input type="submit" value="Add Task" className="btn btn-primary mx-2" />
      </form>

      <hr/>
      
      <h2> All items: </h2>

      <table className="table table-striped table-hover">
    <thead className="thead-dark">
      <tr>
        <th scope="col">#</th>
        <th scope="col">Content</th>
        {/* <th scope="col">Completed?</th> */}
        <th scope="col">Toggle</th>
      </tr>
    </thead>

     <tbody id="taskList">
       {this.state.tasks.map((task, key) => {
         return(
          <tr key={key}>
            <th>{task.id.toString()}</th>
            <td>{ task.isCompleted
               ?<p><del>{task.content}</del></p>
               :<p>{task.content}</p>
              }
            </td>
            {/* <td>{task.isCompleted? 'Yes':'No'}</td> */}
            <td>
              <button
                  id = {task.id}
                  onClick = {(event) => {
                    this.toggleCompleted(event.target.id)
                  }}
              >0</button>
            </td>
         </tr>
         )
       })}

      </tbody>
    </table>
      
    </div>
    }


    return (
      <div>
        
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://google.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            My Todo List
          </a>

          <div>
                <ul className="navbar-nav px-3">
                    <li className="nav-item flex-nowrap d-none d-sm-none d-sm-block">
                        <small className="navbar-text">
                            Your account: {this.state.account}
                        </small>
                    </li>
                </ul>

            </div>
        </nav>


        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
                {content}
            </main>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
