import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.areas', {
  addNewPlaceButton: m('Add new place'),
  empty: {
    description: m('Empty description'),
    title: m('Untitled area'),
  },
  overlay: {
    buttons: {
      cancel: m('Cancel'),
      delete: m('Delete'),
      edit: m('Edit'),
      save: m('Save'),
    },
  },
  place: {
    activityHeader: m('Activity'),
    closeButton: m('Close'),
    description: m('Description'),
    empty: {
      description: m('Empty description'),
      title: m('Untitled place'),
    },
    logActivityButton: m('Log activity'),
    noActivity: m('No visits have been recorded at this place.'),
  },
  tools: {
    cancel: m('Cancel'),
    draw: m('Draw'),
    save: m('Save'),
  },
  viewPlaceButton: m('View place'),
});
