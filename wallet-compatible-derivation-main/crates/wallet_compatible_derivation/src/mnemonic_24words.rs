use crate::prelude::*;
use getrandom;

/// A guaranteed 24 words long BIP-39 mnemonic.
///
/// Holds the BIP-39 entropy - 32 bytes.
#[derive(Debug, Clone, PartialEq, Eq, derive_more::Display, ZeroizeOnDrop, Zeroize)]
#[display("{}", self.phrase())]
pub struct Mnemonic24Words([u8; 32]);

impl Mnemonic24Words {
    pub(crate) fn new(entropy: [u8; 32]) -> Self {
        Self(entropy)
    }

    /// Generates a new random 24-word mnemonic using secure OS entropy.
    /// 
    /// This method uses the operating system's cryptographically secure random
    /// number generator to create 32 bytes of entropy, which is then used to
    /// generate a BIP-39 compliant 24-word mnemonic.
    /// 
    /// # Security
    /// 
    /// This function uses `getrandom` which provides cryptographically secure
    /// randomness from the OS. The entropy is suitable for cryptographic use.
    /// 
    /// # Returns
    /// 
    /// Returns a `Result<Mnemonic24Words, Error>` containing either:
    /// - `Ok(Mnemonic24Words)` - A new random 24-word mnemonic
    /// - `Err(Error)` - If the OS entropy source failed
    /// 
    /// # Examples
    /// 
    /// ```
    /// use wallet_compatible_derivation::Mnemonic24Words;
    /// 
    /// let mnemonic = Mnemonic24Words::generate_random()?;
    /// println!("Generated mnemonic: {}", mnemonic);
    /// ```
    pub fn generate_random() -> Result<Self> {
        let mut entropy = [0u8; 32];
        getrandom::getrandom(&mut entropy).map_err(|_| Error::RandomGenerationFailed)?;
        Ok(Self::new(entropy))
    }
}

impl TryFrom<bip39::Mnemonic> for Mnemonic24Words {
    type Error = crate::Error;

    /// Tries to convert a `bip39` crate `Mnemonic` into `Mnemonic24Words`,
    /// will fail if the word count is not 24.
    fn try_from(value: bip39::Mnemonic) -> Result<Self> {
        if value.word_count() != Self::WORD_COUNT {
            return Err(Error::UnsupportedMnemonicTooFewWords {
                expected: Self::WORD_COUNT,
                found: value.word_count(),
            });
        }
        value
            .to_entropy()
            .try_into()
            .map_err(|_| Error::InvalidMnemonic)
            .map(|v| Self::new(v))
    }
}

impl Mnemonic24Words {
    /// Formats 24 words as a single mnemonic phrase, with space (" ") joining
    /// the words.
    pub fn phrase(&self) -> String {
        self.wrapped().to_string()
    }

    fn wrapped(&self) -> bip39::Mnemonic {
        bip39::Mnemonic::from_entropy(self.0.as_slice())
            .expect("Should always be able to create a BIP-39 mnemonic.")
    }

    pub fn is_zeroized(&self) -> bool {
        self.0 == [0; 32]
    }
}

pub(crate) trait TestValue {
    fn test_0() -> Self;
    fn test_1() -> Self;
}

impl TestValue for Mnemonic24Words {
    fn test_0() -> Self {
        "bright club bacon dinner achieve pull grid save ramp cereal blush woman humble limb repeat video sudden possible story mask neutral prize goose mandate".parse().unwrap()
    }

    fn test_1() -> Self {
        "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo vote".parse().unwrap()
    }
}

impl Mnemonic24Words {
    pub const WORD_COUNT: usize = 24;
    pub fn to_seed(&self, passphrase: impl AsRef<str>) -> [u8; 64] {
        self.wrapped().to_seed(passphrase.as_ref())
    }
}

impl FromStr for Mnemonic24Words {
    type Err = crate::Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        if s == "__test_0" {
            return Ok(Self::test_0());
        }
        if s == "__test_1" {
            return Ok(Self::test_1());
        }
        s.parse::<bip39::Mnemonic>()
            .map_err(|_| Error::InvalidMnemonic)
            .and_then(|m| m.try_into())
    }
}

#[cfg(test)]
mod tests {
    use std::mem;
    use std::ops::Range;

    use crate::prelude::*;

    #[test]
    fn word_count_of_12_disallowed() {
        let intermediary: bip39::Mnemonic = "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong"
            .parse()
            .unwrap();
        assert_eq!(
            Mnemonic24Words::try_from(intermediary),
            Err(Error::UnsupportedMnemonicTooFewWords {
                expected: 24,
                found: 12
            })
        );
    }

    #[test]
    fn word_count_of_24_works() {
        let s = "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo vote";
        assert_eq!(s.parse::<Mnemonic24Words>().unwrap().to_string(), s);
    }

    #[test]
    fn test_0_parse() {
        let sut: Mnemonic24Words = "__test_0".parse().unwrap();
        assert_eq!(sut.to_string(), "bright club bacon dinner achieve pull grid save ramp cereal blush woman humble limb repeat video sudden possible story mask neutral prize goose mandate")
    }

    #[test]
    fn test_1_parse() {
        let sut: Mnemonic24Words = "__test_1".parse().unwrap();
        assert_eq!(sut.to_string(), "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo vote")
    }

    #[test]
    fn entropy() {
        let s = "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo vote";
        assert_eq!(
            hex::encode(s.parse::<Mnemonic24Words>().unwrap().wrapped().to_entropy()),
            "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );
    }

    #[test]
    fn zeroize() {
        let mut mnemonic = Mnemonic24Words::new([
            0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff,
        ]);

        let view = &mnemonic as *const _ as *const u8;
        let end = mem::size_of::<Mnemonic24Words>() as isize;
        let range = Range { start: 0, end };
        for i in range.clone() {
            assert_eq!(unsafe { *view.offset(i) }, 0xff);
        }
        mnemonic.zeroize();
        for i in range.clone() {
            assert_eq!(unsafe { *view.offset(i) }, 0x00);
        }
        assert!(mnemonic.is_zeroized());
    }

    #[test]
    fn generate_random_creates_valid_mnemonic() {
        let mnemonic = Mnemonic24Words::generate_random().unwrap();
        
        // Should be a valid 24-word mnemonic
        assert_eq!(mnemonic.phrase().split_whitespace().count(), 24);
        
        // Should not be zeroized
        assert!(!mnemonic.is_zeroized());
        
        // Should be able to parse back from string
        let parsed = mnemonic.phrase().parse::<Mnemonic24Words>().unwrap();
        assert_eq!(parsed, mnemonic);
    }

    #[test]
    fn generate_random_creates_different_mnemonics() {
        let mnemonic1 = Mnemonic24Words::generate_random().unwrap();
        let mnemonic2 = Mnemonic24Words::generate_random().unwrap();
        
        // Should be different (extremely unlikely to be the same)
        assert_ne!(mnemonic1, mnemonic2);
        assert_ne!(mnemonic1.phrase(), mnemonic2.phrase());
    }

    #[test]
    fn generate_random_entropy_quality() {
        let mnemonic = Mnemonic24Words::generate_random().unwrap();
        
        // Check that we don't have all zeros (which would indicate entropy failure)
        assert_ne!(mnemonic.0, [0u8; 32]);
        
        // Check that we don't have all ones (which would indicate entropy failure)
        assert_ne!(mnemonic.0, [0xffu8; 32]);
    }
}
