'use strict';
const { Model, DataTypes } = require('sequelize');

// A model for the Courses table in our database.
module.exports = (sequelize) => {
    class Course extends Model {}
    Course.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A title is required.'
                },
                notEmpty: {
                    msg: 'Please provide a title.'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A description is required.'
                },
                notEmpty: {
                    msg: 'Please provide a description.'
                }
            }
        },
        estimatedTime: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'An estimated time is required.'
                },
                notEmpty: {
                    msg: 'Please provide an estimated time.'
                }
            }
        },
        materialsNeeded: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Materials needed must be supplied.'
                },
                notEmpty: {
                    msg: 'Please provide the materials needed.'
                }
            }
        }
    }, { sequelize });

    // Creates a relationship with the Users table in our database, and adds the foreign key as the value 'userId'.
    Course.associate = (models) => {
        Course.belongsTo(models.User, { foreignKey: 'userId' });
      };

return Course;
};

(async () => {
    try {
      await Course.sync();
      console.log('Course table synced successfully.');
    } catch (error) {
      console.error('Unable to sync course table successfully:', error);
    }
  });