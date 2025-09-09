import React from "react";
import { v4 as uuidv4 } from "uuid";
import './App.css';


// create test JSON string
const json = `{
"body": [
    {"type": "Header3", "value": "Header3 Value"},
    {"type": "Outline",
        "body": [
        {"type": "Header3",  "value": "body value 1"},
        {"type": "Header3",  "value": "body value 2"}
        ]
    }    
]}`

// convert to JSON object
const original_page = JSON.parse(json);

// Recursively assign IDs to all components to get unique IDs when mapping
// (to test in console use let uuidv4 = crypto.randomUUID.bind(crypto);)
function addIdsToComponents(body) {

  return body.map(component => {
    
    let newComponent = component;
    if (!component.id) {
      newComponent = { ...component, id: uuidv4() };   
    }

    if (component.body) {
      newComponent.body = addIdsToComponents(component.body);
    }

    return newComponent;
  });

}

// give ids to each component
const page = {'body': addIdsToComponents(original_page.body)}


// processes a component, which is a an object with at least a type attribute
const process_component = (component) => {
  if (component.type === "Header3") {
    return <Header3 value = {component.value}></Header3>
  } else if (component.type === "Outline") {
    return <Outline content = {process_body(component.body)}></Outline>
  }
}

// processes the body, which is a list of components
const process_body = (body) => {
  return body.map(component => (
    <React.Fragment key={component.id}>
      {process_component(component)}
    </React.Fragment>
  ));
}

// sample component
function Header3(props) {
  return <h3> {props.value} </h3>
}

// sample component which takes a component / JSX as input
const Outline = ( { content } ) => {
  return (
    <div style = {{border: '2px solid blue'}}>
    {content}  
    </div>
  )
}

// example app
function App() {
  return (
    <div className="App">      
    {process_body(page.body)}
    </div>
  );
}

export default App;
