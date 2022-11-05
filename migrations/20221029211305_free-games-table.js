exports.up = function(knex) {
    return knex.schema.createTable('users', tbl => {
        tbl.increments()
        tbl.text('username', 120).notNullable().unique().index()
        tbl.text('password', 200).notNullable()
        tbl.text('imageUrl').notNullable()
        tbl.text('backgroundColor').notNullable()
        tbl.timestamps(true, true) 
    })

    .createTable('savedGames', tbl => {
        tbl.increments()
        tbl.text('name').notNullable()
        tbl.text('imgUrl').notNullable()
        tbl.text('description').notNullable()
        tbl.text('url').notNullable()
        tbl.integer('user_id').notNullable().unsigned().references('id').inTable('user').onDelete('CASCADE').onUpdate('CASCADE')
        tbl.timestamps(true, true)
    })
}

exports.down = function(knex) {
    return knex.schema.dropTableExists("users").dropTableExists("savedGames")
};

