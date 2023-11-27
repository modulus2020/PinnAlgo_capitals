const Organisation = require('../../models/organisationModel');
const Employment = require('../../models/employmentModel');

const payload = async () => {
  const organisation = await Organisation.findOne();
  const employee = await Employment.findOne();
  return {
    name: 'Backend Developer',
    color: '#FFFF00',
    fields: [
      {
        key: '1',
        input: 'text',
        text: 'What is your name',
      },
      {
        key: '2',
        input: 'dropdown',
        text: 'gender',
        options: [
          {
            optionText: 'Dropdown 1',
            optionValue: 'value 1',
          },
          {
            optionText: 'Dropdown 2',
            optionValue: 'value 2',
          },
          {
            optionText: 'Dropdown 3',
            optionValue: 'value 3',
          },
        ],
      },
      {
        key: '3',
        input: 'radio',
        text: 'remote',
        options: ['Yes', 'No'],
      },
      {
        key: '4',
        input: 'dropdown',
        text: 'select employment input',
        options: [
          {
            optionText: 'hello',
            optionValue: 'hello',
          },
          {
            optionText: 'hey',
            optionValue: 'hey',
          },
          {
            optionText: 'seee',
            optionValue: 'seee',
          },
        ],
      },
    ],
    organisation: organisation.id,
  };
};

module.exports = payload;
