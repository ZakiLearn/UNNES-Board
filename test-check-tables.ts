import { Client } from 'pg'

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  try {
    const res = await client.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      ORDER BY table_name, ordinal_position;
    `)
    
    const tables: Record<string, string[]> = {}
    res.rows.forEach(row => {
      if (!tables[row.table_name]) {
        tables[row.table_name] = []
      }
      tables[row.table_name].push(`${row.column_name} (${row.data_type})`)
    })

    console.log('Tables and columns in public schema:')
    console.log(JSON.stringify(tables, null, 2))
  } catch (err) {
    console.error(err)
  } finally {
    await client.end()
  }
}

run()
