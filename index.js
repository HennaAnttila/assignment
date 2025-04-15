const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.json());


app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
}));

app.set('view engine', 'handlebars');

app.use(express.static('public'));

const dbURI = `mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@${process.env.CLUSTER}/${process.env.DB}?retryWrites=true&w=majority&appName=Cluster0`;

console.log('Connecting to DB with URI:', dbURI);

mongoose.connect(dbURI)
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log("Listening to " + PORT));
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.error('Connection error:', err);
  });

  const Recipe = require('./models/Recipe');

/*
    // insert recipes 

    const recipes = [
      {
        title: "Meringue",
        ingredients: [
          "3 egg whites",
          "2 dl sugar"
        ],
        instructions: "Whisk and bake at 100°C for 1 hour.",
        bakingTimeMinutes: 60,
        isGlutenFree: true
      },
      {
        title: "Chocolate Balls",
        ingredients: [
          "3 dl oats",
          "1 dl sugar",
          "2 tbsp cocoa",
          "100 g butter"
        ],
        instructions: "Mix, roll into balls and chill.",
        bakingTimeMinutes: 0,
        isGlutenFree: false
      },
      {
        title: "Mini Yogurt Cake",
        ingredients: [
          "2 eggs",
          "2 dl yogurt",
          "3 dl flour",
          "1 tsp baking powder",
          "1 dl sugar"
        ],
        instructions: "Mix and bake at 180°C for 25 min.",
        bakingTimeMinutes: 25,
        isGlutenFree: false
      }
    ];

    // Insert recipes
    Recipe.insertMany(recipes)
      .then(result => {
        console.log('Recipes saved:', result);
      })
      .catch(err => {
        console.error('Error saving recipes:', err);
      });

  }) 

  */

//route to show all recipes on a web page
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.render('recipes', {
      title: 'All Recipes',
      recipes: recipes.map(recipe => recipe.toObject())
    });
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).send('Something went wrong');
  }
});

// list all recipes
app.get('/api/recipes', async (req, res) => {
    try {
      const recipes = await Recipe.find();
      res.json(recipes);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching recipes' });
    }
  });
  
  //list the data of one recipe
  app.get('/api/recipes/:id', async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) return res.status(404).json({ message: 'Not found' });
      res.json(recipe);
    } catch (err) {
      res.status(400).json({ message: 'Invalid ID' });
    }
  });

  //create a new recipe
  app.post('/api/recipes', async (req, res) => {
    try {
      const recipe = new Recipe(req.body);
      await recipe.save();
      res.status(201).json(recipe);
    } catch (err) {
      res.status(400).json({ message: 'Error saving recipe' });
    }
  });

  
  // update a recipe
  app.patch('/api/recipes/:id', async (req, res) => {
    try {
      const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: 'Not found' });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: 'Invalid ID' });
    }
  });
  

  
  // delete a recipe
  app.delete('/api/recipes/:id', async (req, res) => {
    try {
      const deleted = await Recipe.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Recipe deleted' });
    } catch (err) {
      res.status(400).json({ message: 'Invalid ID' });
    }
  });
  