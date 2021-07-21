// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    
    uint public taskCount;
    
    struct Task {
        uint id;
        string content;
        bool isCompleted;
    }
    
    mapping (uint => Task) public tasks;
    
    event TaskCreated(uint id, string content, bool isCompleted);
    event CompletedToggled(uint id, string content, bool isCompleted);
    
    constructor () {
        createTask('read a book');
        createTask('go to gym');
    }
    
    function createTask (string memory _content) public {
        require(bytes(_content).length > 0, 'Content cannot be empty!' );
        
        for(uint i=1; i<=taskCount; i++){
            // return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
            require(  keccak256(abi.encodePacked(_content)) !=  keccak256(abi.encodePacked(tasks[i].content)) , 'This task already exists!' );
        }
        
        taskCount++;
        tasks[taskCount].id = taskCount;
        tasks[taskCount].content = _content;
        tasks[taskCount].isCompleted = false;
        
        emit TaskCreated(taskCount, _content, false);
    }
    
    function toggleCompleted (uint _id) public {
        require( _id > 0 && _id <= taskCount, 'Invalid id!');
        Task memory _task = tasks[_id];
        _task.isCompleted = !_task.isCompleted;
        tasks[_id] = _task;
        
        emit CompletedToggled(_id, _task.content, _task.isCompleted);
    }
    
}