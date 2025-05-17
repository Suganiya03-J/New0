import React from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import InvoiceForm from "./components/Invoiceform";


function App() {
  return (
    <div className="App">
      <div className="text-center pt-4">
        
      </div>

      <Container className="pt-4">
        <InvoiceForm />
      </Container>
    </div>
  );
}

export default App;