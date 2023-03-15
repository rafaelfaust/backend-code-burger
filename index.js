const express = require('express');

const uuid = require('uuid');

const cors = require('cors');

const port = 3001;

const app = express();

app.use(express.json());

app.use(cors());

const orders = [];

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    
    const index = orders.findIndex(order => order.id === id)
    
    if(index < 0){
        return response.status(404).json({error: "Order nothing found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()

};

app.get('/orders', (request, response) => {
    return response.json(orders)
})


app.post('/orders', (request, response) => {
    try {
        const {list, name} = request.body;
    
        const order = { id: uuid.v4(), list, name };
    
        orders.push(order);
    
        return response.status(201).json(order);
    } catch(error){
        return response.status(500).json("order");
    }
    });


    app.put('/orders/:id', checkOrderId, (request, response) => {
        const { list, name } = request.body
        const index = request.orderIndex
        const id = request.orderId
    
        const updateOrder = { id, list, name }
        
        orders[index] = updateOrder
    
        return response.json(updateOrder)
    });

    app.delete('/orders/:id', checkOrderId, (request, response) => {
        const index = request.orderIndex
    
        orders.splice(index,1)
    
        return response.status(204).json()
    });
    
    app.listen(port, () => {
        console.log(`Server started on port ${port}`)
    });