const { User } = require("../model/UserModel");

const addUser = async (req, res) => {
    try {
        const { name, email, phoneNo } = req.body;

        await User.create({ name, email, phoneNo });

        return res.status(200).json({ msg: "User created successfully." });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        return res.status(200).json(users);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const getUserByID = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const deleteUsers = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.destroy({ where: { id: id } });

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const updateUsers = async (req, res) => {
    const { id } = req.params;

    try {
        const { name, email, phoneNo } = req.body;

        const [updatedRows] = await User.update(
            { name, email, phoneNo },  // Fields to update
            { where: { id: id } }       // Condition
        );

        if (updatedRows === 0) {
            return res.status(404).json({ message: "User not found or no changes made." });
        }

        return res.status(200).json({ message: "User updated successfully." });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { addUser, getUsers, getUserByID, deleteUsers, updateUsers };
