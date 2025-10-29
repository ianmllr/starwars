const fs = require('fs');
const path = require('path');

const charactersPath = path.join(__dirname, '..', 'data', 'characters.json');

const readData = () => {
    const jsonData = fs.readFileSync(charactersPath, 'utf-8');
    return JSON.parse(jsonData);
}

const writeData = (data) => {
    fs.writeFileSync(charactersPath, JSON.stringify(data, null, 2));
};



const validateCharacter = (character) => {
    const errors = [];

    if (!character.name || character.name.length < 2) {
        errors.push('navnet skal være mindst 2 karaktere langt');
    }

    const validRoles = ['Jedi', 'Sith', 'Rebel', 'Smuggler'];
    if (!character.role || !validRoles.includes(character.role)) {
        errors.push("Rollen skal være enten: 'Jedi', 'Sith', 'Rebel' or 'Smuggler'");
    }

    return errors;
};

exports.createCharacter = (req, res) => {

    const data = readData();
    let newCharacter;
    try {
        newCharacter = {
            id: data.nextId++,
            name: req.body.name,
            role: req.body.role,
            homeworld: req.body.homeworld || 'Unknown'
        };

        data.character.push(newCharacter);
        writeData(data);
    } catch (error) {
        res.status(500).json({error: 'Kunne ikke oprette ny karakter'})
    }

    res.status(201).json({
        message: 'Karakteren er lavet',
        character: newCharacter
    });
}

exports.getAllCharacters = (req, res) => {
    try {
        const data = readData();
        res.json(data.character);
    } catch (error) {
        res.status(500).json({error: 'Kunne ikke læse characters.json'}); // Opgave 3.3
    }
};

exports.deleteCharacter = (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const characterIndex = data.character.findIndex(c => c.id === id);

    if (characterIndex === -1) {
        return res.status(404).json({ error: 'Karakter ikke fundet' });
    }

    const deletedCharacter = data.character.splice(characterIndex, 1)[0];
    writeData(data);

    res.json({
        message: 'Karakter slettet',
        character: deletedCharacter
    });
};
