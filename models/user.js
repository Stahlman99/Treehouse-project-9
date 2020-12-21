'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

// A model for the Users table in our database.
module.exports = (sequelize) => {
    class User extends Model {}
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A first name is required.'
                },
                notEmpty: {
                    msg: 'Please provide a first name.'
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A last name is required.'
                },
                notEmpty: {
                    msg: 'Please provide a last name.'
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'An email address is required.'
                },
                notEmpty: {
                    msg: 'Please provide an email address.'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A password is required.'
                },
                notEmpty: {
                    msg: 'Please provide a password.'
                }
            },
            set(val) {
                const hashedPassword = bcrypt.hashSync(val, 10);
                this.setDataValue('password', hashedPassword);
            }
        }
    }, { sequelize });

    // Creates a relationship with the Courses table in our database, and uses the id as the foreign key for that relationship.
    User.associate = (models) => {
        User.hasMany(models.Course, { foreignKey: 'userId' });
      };

return User;
};

(async () => {
    try {
      await User.sync();
      console.log('Users table synced successfully.');
    } catch (error) {
      console.error('Unable to sync Users table successfully:', error);
    }
  });