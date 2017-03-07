var visTestDataStructureIdea = {
  visualization: { // one for every visualization
    enterTime: undefined, // save the moment the user first enters a visualization
    exitTime: undefined, // save the moment the user first exits a visualization
    elementInteraction: { // one for every type of element that has a microinteraction in a especific visualization
      firstInteration: undefined, 
      // save the moment the user first sees a microinteraction
      // of an especific element
      firstResponse: undefined,
      // save the moment the user first uses an especific 
      // interaction of an element
      firstElementOfInteraction: undefined,
      // save the first element to show the user a microinteraction
      firstElementOfResponse: undefined,
      // save the first element the user responds to a microinteraction
      reponsesCount: 0,
      // count the amount of times the user uses an especific
      // interaction of an element
    }
  }
};