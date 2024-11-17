import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import RecipeCard from './recipeCard';
const TodayMenu = ({ recipes,currentDay }) => {

  console.log("RECIPES: ",recipes);
  console.log("currentDay: ",currentDay);
  return (
    <View className="flex-1 ">
    
      <ScrollView showsVerticalScrollIndicator={false}>
        {recipes.map((recipe, index) => (
          <RecipeCard
            key={index}
            title={recipe.title}
            description={recipe.description}
            duration={recipe.duration}
            imageUrl={recipe.imageUrl}
            currentDay={currentDay}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default TodayMenu;