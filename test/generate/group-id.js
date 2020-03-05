const { Server, print } = require('../helpers')

const generators = [
  (i) => {
    const server = Server()

    server.publish({ type: 'first' }, (err, msg) => {

      server.private2.group.create('3 musketeers', (err, data) => {
        server.close()

        const vector = {
          type: 'group_id',
          description: 'determine the group_id (remember group_id is derived from read_key of init msg)',
          input: {
            group_key: data.groupKey,
            group_init_msg: data.groupInitMsg
          },
          output: {
            group_id: data.groupId
          }
        }
        print(`vectors/group-id${i + 1}.json`, vector)
      })
    })
  }
]

generators.forEach((fn, i) => fn(i))
