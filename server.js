
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3005;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

function classificarIMC(imc) {
    if (imc < 18.5) {
        return "Abaixo do peso";
    } else if (imc >= 18.5 && imc < 25) {
        return "Peso normal";
    } else if (imc >= 25 && imc < 30) {
        return "Sobrepeso";
    } else if (imc >= 30 && imc < 35) {
        return "Obesidade grau I";
    } else if (imc >= 35 && imc < 40) {
        return "Obesidade grau II";
    } else {
        return "Obesidade grau III";
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/calcular-imc', (req, res) => {
    try {
        const { nome, altura, peso } = req.body;
        
        if (!nome || !altura || !peso) {
            return res.status(400).json({
                erro: 'Todos os campos são obrigatórios'
            });
        }
        

        const alturaNum = parseFloat(altura);
        const pesoNum = parseFloat(peso);
        
        // Validar se são números válidos
        if (isNaN(alturaNum) || isNaN(pesoNum) || alturaNum <= 0 || pesoNum <= 0) {
            return res.status(400).json({
                erro: 'Altura e peso devem ser números válidos e maiores que zero'
            });
        }
        
        // Calcular o IMC
        const imc = pesoNum / (alturaNum * alturaNum);
        const classificacao = classificarIMC(imc);
        
        // Retornar o resultado
        res.json({
            nome: nome,
            imc: imc.toFixed(2),
            classificacao: classificacao,
            sucesso: true
        });
        
    } catch (error) {
        res.status(500).json({
            erro: 'Erro interno do servidor',
            sucesso: false
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
