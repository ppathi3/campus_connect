document.addEventListener('DOMContentLoaded', function() {
    const freeEventRadio = document.getElementById('free-event');
    const paidEventRadio = document.getElementById('paid-event');
    const entryFeeInput = document.getElementById('entry-fee');

    // Function to disable attribute based on the selected event type
    function disableEntryFeeInput() {
        if (freeEventRadio.checked) {
            entryFeeInput.disabled = true;
            entryFeeInput.value = ''; // Clear the entry fee value when the event is free
        } else if (paidEventRadio.checked) {
            entryFeeInput.disabled = false;
        }
    }

    // Add event listeners to the radio buttons
    freeEventRadio.addEventListener('change', disableEntryFeeInput);
    paidEventRadio.addEventListener('change', disableEntryFeeInput);

    // Call the function on page load to set the initial state
    disableEntryFeeInput();
});
