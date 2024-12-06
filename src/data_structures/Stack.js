export class Stack {
    constructor() {
      this.items = [];
    }
  
    push(element) {
      // Add an element to the top of the stack
      this.items.push(element);
    }
  
    pop() {
      // Remove and return the top element of the stack
      if (this.isEmpty()) {
        return "Underflow";
      }
      return this.items.pop();
    }
  
    peek() {
      // Get the top element of the stack without removing it
      if (this.isEmpty()) {
        return "Underflow";
      }
      return this.items[this.items.length - 1];
    }
  
    isEmpty() {
      // Check if the stack is empty
      return this.items.length === 0;
    }
  
    size() {
      // Return the size of the stack
      return this.items.length;
    }
  }