import gitClone from 'git-clone';
import fs from 'fs';
import path from 'path';


function cloneRepository(repositoryUrl, destinationPath) {
    return new Promise((resolve, reject) => {
      gitClone(repositoryUrl, destinationPath, {}, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  function readDirectoryContents(directoryPath) {
    return new Promise((resolve, reject) => {
      fs.readdir(directoryPath, (error, files) => {
        if (error) {
          reject(error);
        } else {
          const result = [];
          const fileReadPromises = files.map((file) => {
            const filePath = path.join(directoryPath, file);
            return getFileStats(filePath)
              .then((stats) => {
                if (stats.isFile()) {
                  return readFileContents(filePath)
                    .then((contents) => {
                        const filteredContents = removeNewlines(contents)
                      result.push({ fileName: file, content: filteredContents });
                    });
                }
              });
          });
  
          Promise.all(fileReadPromises)
            .then(() => {
              resolve(result);
            })
            .catch((error) => {
              reject(error);
            });
        }
      });
    });
  }
  function extractRepositoryName(url) {
    const parts = url.split('/');
    const repositoryWithGitExtension = parts[parts.length - 1];
    const repositoryName = repositoryWithGitExtension.replace('.git', '');
    return repositoryName;
  }

  const repositoryUrl = 'https://github.com/sehmim/music-release-bot-twitter.git';
  const destinationPath = './repos/' + extractRepositoryName(repositoryUrl);

cloneRepository(repositoryUrl, destinationPath)
  .then(() => {
    console.log('Repository cloned successfully!');
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });


function getFileStats(filePath) {
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (error, stats) => {
        if (error) {
          reject(error);
        } else {
          resolve(stats);
        }
      });
    });
  }

  function readFileContents(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  function removeNewlines(str) {
    return str.replace(/\n/g, '');
  }

  // Usage: Pass the directory path as an argument
// const directoryPath = './repos';


// readDirectoryContents(directoryPath)
//   .then((result) => {
//     console.log('Result:', result);
//   })
//   .catch((error) => {
//     console.error('Error:', error.message);
//   });

// module.exports = {
//     readDirectoryContents
// }