const swaggerAutogen=require('swagger-autogen')(); //includere e istanziare, come per express
const doc={
    info:{
        title:'RhythmHub',
        description:'Description',
    },
    host:'0.0.0.0:3001',
    schemes:['http'],
};
const outputFile='./swagger-output.json'
const endpointFiles=['./paths.js']
swaggerAutogen(outputFile, endpointFiles, doc)