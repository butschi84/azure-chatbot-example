function getMeal(vegetarian = false) {
    const vegetarianMeals = [
      "Veggie Stir-Fry",
      "Caprese Salad",
      "Lentil Curry",
      "Spinach and Mushroom Quesadillas",
      "Vegetable Lasagna",
      "Chickpea Salad",
      "Falafel Wrap",
      "Margherita Pizza",
      "Vegetable Biryani",
      "Stuffed Bell Peppers"
    ];
  
    const meatMeals = [
      "Grilled Chicken Breast",
      "Beef Stir-Fry",
      "Spaghetti Bolognese",
      "BBQ Ribs",
      "Roast Turkey",
      "Fish Tacos",
      "Lamb Kebabs",
      "Pork Chops",
      "Chicken Parmesan",
      "Beef Burgers"
    ];
    console.log(vegetarian)
  
    const meals = vegetarian ? vegetarianMeals : meatMeals;
    const randomIndex = Math.floor(Math.random() * meals.length);
    return meals[randomIndex];
  }

  module.exports = getMeal