import './App.css';
import React from 'react';
//Import the entity data and metadata files
import { entityData } from "./entityData";
import { metaData } from "./entityMeta";

class App extends React.Component {
  constructor(props) {
    super(props);
    //entityData holds array of entities & selected row holds the selected entity from the table( initially it is null )
    this.state = {entityData:entityData, selectedRow:{ "firstName":"","lastName":"","dob":"","country":""}};
    this.addEntity = this.addEntity.bind(this);
    this.updateRow = this.updateRow.bind(this);
  }
  
  //concatenating new entity in (changing state and local storage as well)
  addEntity(entity) {
    //console.log("add entity");
    let newEntityData = this.state.entityData.concat([entity])
    localStorage.setItem('entityData', JSON.stringify(newEntityData));
    this.setState({
        entityData: newEntityData
    });
  }
  
  //updating the existing entity (changing state and local storage as well)
  updateEntity(entity) {
    //console.log("update entity");
    let newEntityData = entity;
    localStorage.setItem('entityData', JSON.stringify(newEntityData));
    this.setState({
        entityData: newEntityData
    });  
  }
  
  //updating the currently selected row state
  updateRow(row) {
    //console.log("update row");
    let newRow = row;
    this.setState({
        selectedRow: newRow
    });
  }
  
  //invoked afte the entityData is mounted
  componentDidMount(){
     //console.log("mounted")
     let newEntityData = localStorage.entityData
     if(newEntityData != undefined){
         this.setState({
             entityData: JSON.parse(newEntityData)
         });
     }
     //console.log(this.state.entityData);
  }
  
  //handle changes in the form
  handleChange = (event) => {
      //console.log("handle change");
      //console.log(this.state.entityData); 
      event.preventDefault();
      var obj = this.state.selectedRow;
      obj[event.target.name] = event.target.value
      this.setState({
             selectedRow: obj
         });
      //console.log(this.state.entityData); 
  }
  
  //check if entity exists in the entityData and then update or insert
  upsert(array, item) {
      //console.log("upsert");
      var oldJSON = new Object();
      //console.log(array);
      //console.log(item);
      var i = array.findIndex(_item => _item.firstName === item.firstName);
      if (i > -1){
          //console.log(array[i]);
          oldJSON = array[i];
          array[i] = item;
          //console.log("old updated");
          //console.log(oldJSON);
      } 
      else{
          array.push(item);
          //console.log("new updated");
      }
      
      //creating JSON obj that displays old and new JSON
      
      //console.log(item)
      var newJSON = item;
      newJSON["$original"] = oldJSON;
      document.getElementById("JSONObj").innerHTML = JSON.stringify(newJSON);
      return array;
  }

  //Updates or inserts entity on form submission
  formSubmitHandler = (event) => {
    //console.log("form");
    event.preventDefault();
    var obj = new Object();
    obj.firstName = event.target[0].value;
    obj.lastName  = event.target[1].value;
    obj.dob = event.target[2].value;
    obj.country = event.target[3].value;
    //console.log(this.state.entityData);
    var newEntityData = this.upsert(this.state.entityData,obj);
    this.updateEntity(newEntityData);
  }
  
  //Displays the selected row from the table, also checks the metadata for which fields to modify
  rowClickHandler(data) {
    //console.log("row click");
    this.updateRow(data);
    document.getElementById("fname").disabled = metaData['firstName'].system;
    document.getElementById("lname").disabled = metaData['lastName'].system;
    document.getElementById("dob").disabled = metaData['dob'].system;
    document.getElementById("country").disabled = metaData['country'].system;
    document.getElementById("JSONObj").innerHTML = "";
  }
  render() {
    return (
      <div className="App">
      <div className = "App-header">
        <p>Web application</p>
      </div>
      <div class="form-container">
        <div>
         <table id="entity-table">
           <thead>
            <th>First Name</th>
            <th>Last Name</th>
            <th>DOB</th>
            <th>Country</th>
           </thead>
           <tbody>
           {
                this.state.entityData.map(data => (
                <tr onClick={() => this.rowClickHandler(data)}>
                    <td>{data.firstName}</td>
                    <td>{data.lastName}</td>
                    <td>{data.dob}</td>
                    <td>{data.country}</td>
                </tr>
            ))}
           </tbody>
         </table>
        </div>
      </div>
      <div class="form-container">
        <div class="form-child">
          <form onSubmit={this.formSubmitHandler} onChange={this.handleChange}>
            <label for="fname">First Name</label>
            <input type="text" id="fname" name="firstName" value={this.state.selectedRow.firstName}></input>

            <label for="lname">Last Name</label>
            <input type="text" id="lname" name="lastName" value={this.state.selectedRow.lastName}></input>

            <label for="dob">Date of birth</label>
            <input type="date" id="dob" name="dob" value={this.state.selectedRow.dob}></input>
        
            <label for="country">Country</label>
            <select name="country" id="country" value={this.state.selectedRow.country}>
              <option value="Germany">Germany</option>
              <option value="Italy">Italy</option>
              <option value="Sweden">Sweden</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Others">Others</option>
            </select>
        
            
            
            <input type='submit' value="Submit"></input>
          </form>
          
        </div>
        <div class="form-child">
          <h2>JSON data</h2>
          <div id="JSONObj"></div>
        </div>
      </div>
    </div>
    );
  }
}

export default App;
