use clap::{Arg, Command};
use schema_gen::ez_mode_gen::generate_ir;
use schema_gen::gateway;
use std::process;

fn main() {
    let matches = Command::new("schema-gen-cli")
        .version("1.0")
        .about("Generate TypeScript types from Radix package schemas")
        .arg(
            Arg::new("package")
                .help("Package address to generate types for")
                .required(true)
                .index(1),
        )
        .arg(
            Arg::new("module")
                .long("module")
                .help("Generate as ES module")
                .action(clap::ArgAction::SetTrue),
        )
        .get_matches();

    let package_address = matches.get_one::<String>("package").unwrap();
    let module = matches.get_flag("module");

    // Detect network from package address
    let network = match gateway::Network::from_package_address(package_address) {
        Ok(network) => network,
        Err(e) => {
            eprintln!("Error: {}", e);
            process::exit(1);
        }
    };

    eprintln!("Detected network: {:?}", network);
    eprintln!("Generating types for package: {}", package_address);

    // Get schemas and blueprints
    let schemas = match gateway::get_blueprints_and_corresponding_schemas(package_address) {
        Ok(schemas) => schemas,
        Err(e) => {
            eprintln!("Error fetching schemas: {}", e);
            process::exit(1);
        }
    };

    // Generate TypeScript types
    let registry = generate_ir(&schemas);
    let typescript_code = registry.render(package_address, module);

    // Output to stdout
    println!("{}", typescript_code);
}
