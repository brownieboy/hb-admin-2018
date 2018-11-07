// Important: these methods have to be defined as "ordinary" functions.
// They cannot be fat arrow functions if we're binding them to the
// context of the React component that's using them.  You cannot
// rebind a fat arrow function!!!

export function handleCheck(e, id) {
  // console.log("lifecycleextras..handleCheck");
  const { selectedItems } = this.state;
  let newItems;
  if (e.target.checked) {
    newItems = [...selectedItems, id];
  } else {
    const index = selectedItems.indexOf(id);
    newItems = [
      ...selectedItems.slice(0, index),
      ...selectedItems.slice(index + 1)
    ];
  }
  this.setState({ selectedItems: newItems });
}

// Doing this the way above proved a bit limiting, so here
// it is as a straight function
export function getChecked(e, id, items) {
  // console.log("lifecycleextras..handleCheck");
  if (e.target.checked) {
    return [...items, id];
  }
  const index = items.indexOf(id);
  return [...items.slice(0, index), ...items.slice(index + 1)];

}
