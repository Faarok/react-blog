import db from './init.db.js';

const profileDb = {
    tableName: 'profile',

    createProfile: async function(profileData) {
        // TODO: Gérer les permissions via le profil avec de créer la donnée
        let builder = db.queryBuilder.insert();
    }
}

export default profileDb;