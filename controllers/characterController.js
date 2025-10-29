const fs = require('fs');
const path = require('path');
const {logAction} = require('../middleware/logger');

const charactersPath = path.join(__dirname, '..', 'data', 'characters.json');
const rolesPath = path.join(__dirname, '..', 'data', 'roles.json');


const readCharacters = () => {
    const jsonData = fs.readFileSync(charactersPath, 'utf-8');
    return JSON.parse(jsonData);
}

const readRoles = () => {
    const jsonData = fs.readFileSync(rolesPath, 'utf-8');
    return JSON.parse(jsonData);
}

const writeData = (data) => {
    fs.writeFileSync(charactersPath, JSON.stringify(data, null, 2));
};


exports.createCharacter = (req, res) => {
    console.log('=== CREATE CHARACTER START ===');
    console.log('Request body:', req.body);

    const data = readCharacters();
    const roles = readRoles();
    const validRoles = roles.roles;

    let newCharacter;

    try {
        let newId;
        if (data.characters.length > 0) {
            newId = data.characters[data.characters.length - 1].id + 1;
        } else {
            newId = 1;
        }

        if (req.body.name.length < 2) {
            return res.status(400).json({error: 'Navnet er for kort. Skal være mindst 2 bogstaver.'})
        }

        if (!validRoles.includes(req.body.role)) {
            return res.status(400).json({error: 'Ugyldig rolle. Skal være enten sith, jedi, rebel eller smuggler.'})
        }

        newCharacter = {
            id: newId,
            name: req.body.name,
            role: req.body.role,
            homeworld: req.body.homeworld || 'Unknown'
        };
        console.log("Ny karakter objekt:" + newCharacter)

        data.characters.push(newCharacter); // tilføjer til characters.json

        writeData(data);

        return res.status(201).json({
            message: 'Karakteren er lavet',
            character: newCharacter
        });
    } catch (error) {
        console.log('Kunne ikke oprette ny karakter', error);
        return res.status(500).json({error: 'Kunne ikke oprette ny karakter'})
    }
}

exports.getAllCharacters = (req, res) => {
    try {
        const data = readCharacters();
        res.json(data.characters);
    } catch (error) {
        res.status(500).json({error: 'Kunne ikke læse characters.json'});
    }
};

exports.downloadAllCharacters = (req, res) => {
    try {
        const data = readCharacters();

        // Format all characters as text
        const allCharactersText = data.characters.map(character => `
Karakter:
=====================
ID: ${character.id}
Name: ${character.name}
Role: ${character.role}
Homeworld: ${character.homeworld}
`).join('\n');

        const tempDir = path.join(__dirname, '..', 'temp');

        const fileName = 'all_characters.txt';
        const filePath = path.join(tempDir, fileName);

        fs.writeFileSync(filePath, allCharactersText);

        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Download error:', err);
            }
            fs.unlinkSync(filePath);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'Download fejlede'});
    }
};



exports.downloadCharacter = (req, res) => {
    const data = readCharacters();
    const id = parseInt(req.params.id);

    const character = data.characters.find(c => c.id === id);

    if (!character) {
        return res.status(404).json({error: 'Karakter ikke fundet'})
    }

    const characterText = `Karakter:
=====================
ID: ${character.id}
Name: ${character.name}
Role: ${character.role}
Homeworld: ${character.homeworld}
`;

    const tempDir = path.join(__dirname, '..', 'temp');
    const fileName = `character_${character.name}.txt`;
    const filePath = path.join(tempDir, fileName);

    fs.writeFileSync(filePath, characterText);

    try {
        res.download(filePath, fileName)
    } catch (error) {
        res.status(500).json({error: 'Download fejlede'})
    }
}


exports.deleteCharacter = (req, res) => {
    const data = readCharacters();
    const id = parseInt(req.params.id);

    const characterIndex = data.characters.findIndex(c => c.id === id);

    if (characterIndex === -1) {
        return res.status(404).json({ error: 'Karakter ikke fundet' });
    }

    const deletedCharacter = data.characters.splice(characterIndex, 1)[0];
    writeData(data);

    logAction('Karakter slettet', deletedCharacter.name);

    return res.status(200).json({ message: 'Karakter slettet' });
};