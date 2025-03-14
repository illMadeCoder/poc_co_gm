import { SuggestionObj } from "suggestionTypes";

import { SuggestionCategory } from "./enums";

export const suggestionMocks: SuggestionObj[] = [
  {
    id: "number1",
    category: SuggestionCategory.dialogue,
    suggestion:
      'Peasant says: "You should go see the magistrate, he was mentioning he needed help."',
    relevancyScore: 80,
  },
  {
    id: "number2",
    category: SuggestionCategory.monsters,
    suggestion:
      "A blast shakes the town. A Minotaur has blasted through the wall, and he's coming at you. Roll for initiation!",
    relevancyScore: 85,
  },
  {
    id: "number3",
    category: SuggestionCategory.items,
    suggestion: "You find a bag holding in the chest.",
    relevancyScore: 60,
  },
];
