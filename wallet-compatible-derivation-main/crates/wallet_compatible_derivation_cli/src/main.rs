mod config;
mod read_config_from_stdin;
use crate::config::{Config, GenerateConfig};
use crate::read_config_from_stdin::*;

use clap::{Parser, Subcommand};

use wallet_compatible_derivation::prelude::*;

use pager::Pager;
use std::{ops::Range, thread, time};
use zeroize::Zeroize;

#[derive(Parser)]
#[command(name = "wallet_compatible_derivation_cli", version)]
#[command(
about = "Babylon Account CreatiON.",
long_about = format!(r#"
Generate Radix Babylon accounts - private (and public) keys and addresses given a mnemonic, Network ID (Mainnet/Stokenet) and indices.
"#)
)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,

    /// If the PrivateKey of derived accounts is included in output.
    #[arg(short, long, default_value_t = false)]
    pub(crate) include_private_key: bool,
}

#[derive(Subcommand)]
enum Commands {
    NoPager(Config),
    Pager,
    /// Generate a new random 24-word mnemonic
    Generate(GenerateConfig),
}

fn paged() {
    Pager::new().setup();

    // Pager setup is a bit slow, if we don't add this terribly ugly hacky
    // sleep, the output of inquire is not shown.
    thread::sleep(time::Duration::from_millis(250));
}

fn main() {
    let cli = Cli::parse();
    let command = cli.command.unwrap_or(Commands::Pager);
    
    match command {
        Commands::Generate(generate_config) => {
            handle_generate_command(generate_config, cli.include_private_key);
        }
        Commands::NoPager(c) => {
            handle_derive_command(c, cli.include_private_key);
        }
        Commands::Pager => {
            paged();
            let config = read_config_from_stdin().expect("Valid config");
            handle_derive_command(config, cli.include_private_key);
        }
    }
}

fn handle_generate_command(config: GenerateConfig, include_private_key: bool) {
    // Generate a new random mnemonic
    let mnemonic = match Mnemonic24Words::generate_random() {
        Ok(m) => m,
        Err(e) => {
            eprintln!("❌ Failed to generate random mnemonic: {}", e);
            std::process::exit(1);
        }
    };

    // Print the mnemonic
    print_generated_mnemonic(&mnemonic);

    // If accounts should be generated, derive them
    if config.generate_accounts {
        println!("\n🔑 Generating accounts for the new mnemonic...\n");
        
        let start = config.start;
        let count = config.count as u32;
        let end = start + count;
        for index in (Range { start, end }) {
            let account_path = AccountPath::new(&config.network, index);
            let mut account = Account::derive(&mnemonic, &config.passphrase, &account_path);
            print_account(&account, include_private_key);
            account.zeroize();
        }
    }
}

fn handle_derive_command(mut config: Config, include_private_key: bool) {
    let start = config.start;
    let count = config.count as u32;
    let end = start + count;
    for index in (Range { start, end }) {
        let account_path = AccountPath::new(&config.network, index);
        let mut account = Account::derive(&config.mnemonic, &config.passphrase, &account_path);
        print_account(&account, include_private_key);
        account.zeroize();
    }

    config.zeroize();
    drop(config);
}

fn print_generated_mnemonic(mnemonic: &Mnemonic24Words) {
    let delimiter = "🔐".repeat(WIDTH);
    let header_delimiter = "🎲".repeat(WIDTH);
    let header = ["✨ GENERATED MNEMONIC ✨", &header_delimiter].join("\n");
    
    let warning = "⚠️  SECURITY WARNING: Keep this mnemonic safe and private!\n⚠️  Anyone with this mnemonic can access your accounts.\n⚠️  Write it down and store it in a secure location.";
    
    let output = [
        delimiter.clone(),
        header,
        format!("Mnemonic: {}", mnemonic.phrase()),
        warning.to_string(),
        delimiter,
    ]
    .join("\n");
    
    println!("{}", output);
}

const WIDTH: usize = 50;

fn print_account(account: &Account, include_private_key: bool) {
    let delimiter = "✨".repeat(WIDTH);
    let header_delimiter = "🔮".repeat(WIDTH);
    let header = ["✅ CREATED ACCOUNT ✅", &header_delimiter].join("\n");
    let account_string = account.to_string_include_private_key(include_private_key);
    let output = [
        delimiter.clone(),
        header,
        format!("{account_string}"),
        delimiter,
    ]
    .join("\n");
    println!("\n{output}");
}
