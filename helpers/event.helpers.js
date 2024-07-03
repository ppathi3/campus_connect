exports.sortEvents = (eventsList) => {
    // sort the events array by title
    eventsList.sort((a, b) => {
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
    });
    return eventsList;
}

exports.findDistinctEventCategories = (events) => {
    const categories = [...new Set(events.map(event => event.category))];
    return categories.sort();
};