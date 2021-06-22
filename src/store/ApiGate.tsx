export const ApiGate = async () => {
    

    interface UrlArray {
        name: string,
        id: number,
        height: number,
        weight: number,
        types: string[],
        species: {
            url: string
        },
        color: string
    }
    
    const pokemons: any[] = []
   
    const url = `https://pokeapi.co/api/v2/pokemon/`
    const call = await fetch(url)
    const response = await call.json()
    response.results.map( (d: { name: string; url: string }) => ({
        name: d.name,
        url: fetch(d.url)
            .then(response => response.json())
            .then(async (data : UrlArray) => ({
                name: data.name,
                id: data.id,
                height: data.height,
                weight: data.weight,
                types: data.types,
                species: await fetch(data.species.url)
                .then(response => response.json())
                .then(async data => ({
                    color: data.color.name,
                    flavor_text_entries: data.flavor_text_entries[0].flavor_text,
                    habitat: data.habitat.name,
                    is_baby: data.is_baby,
                    is_legendary: data.is_legendary,
                    is_mythical: data.is_mythical,
                    evolution_chain: await fetch(data.evolution_chain.url)
                        .then(response => response.json())
                        .then(data => ({
                            evolves_1: data.chain.species.name.length > 0 
                                ?  data.chain.species.name 
                                : null,
                            evolves_2: data.chain.evolves_to[0] 
                                ? data.chain.evolves_to[0].species.name 
                                : null ,
                            evolves_3: data.chain.evolves_to[0].evolves_to[0]
                                ? data.chain.evolves_to[0].evolves_to[0].species.name 
                                : null, 
                            }))
                        }))
            }))
            .then(data => ({
                name: data.name,
                id: data.id,
                height: data.height,
                weight: data.weight,
                types: data.types,
                color: data.species.color,
                description: data.species.flavor_text_entries,
                habitat: data.species.habitat,
                legendary: data.species.is_legendary,
                mythical: data.species.is_mythical,
                evolution: data.species.evolution_chain,
            }))
            .then(data => pokemons.push(data))
    }))
    return console.log('pokemons', pokemons)
}
