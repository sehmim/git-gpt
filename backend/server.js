import express from 'express';
import fetch from 'node-fetch';
import gitClone from 'git-clone';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 3000;
app.use(cors());

// GET route for /hello
app.get('/clone', async (req, res) => {
    const repository = req.query.repo;

    if (repository) {
        try {
            const repositoryUrl = repository;
            const destinationPath = './repos/' + extractRepositoryName(repositoryUrl);

            await cloneRepository(repository, destinationPath);
            res.send("DONE CLONING...");
        } catch (error) {
            console.log(error)
        }

    } else {
        res.send('Hello, World!');
    }
});

// GET route for /hello
app.get('/content', async (req, res) => {
    const repository = req.query.repo;

    if (repository) {
        try {
            const repositoryUrl = repository;
            const destinationPath = './repos/' + extractRepositoryName(repositoryUrl);

            const result = await readDirectoryContents(destinationPath);
            res.send(JSON.stringify(result, 2, null));
        } catch (error) {
            console.log(error)
        }

    } else {
        res.send('Hello, World!');
    }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


async function downloadAndReadRepositoryFiles(repositoryUrl) {
    try {
      // Fetch repository details
      const repositoryResponse = await fetch(repositoryUrl);
      const repositoryData = await repositoryResponse.json();
      const { default_branch: branch, owner, name } = repositoryData;
  
      // Fetch tree details
      const treeUrl = `https://api.github.com/repos/${owner.login}/${name}/git/trees/${branch}?recursive=1`;
      const treeResponse = await fetch(treeUrl);
      const treeData = await treeResponse.json();
      const { tree } = treeData;
  
      // Download and read each file
      for (const file of tree) {
        if (file.type === 'blob') {
          const fileUrl = file.url.replace('https://api.github.com', 'https://raw.githubusercontent.com');
          const fileResponse = await fetch(fileUrl);
          const fileContents = await fileResponse.text();
  
          // Do something with the file contents
          console.log(`File: ${file.path}`);
          console.log('Contents:');
          console.log(fileContents);
            
          return fileContents;
          // Save the file if needed
        //   const fileName = path.basename(file.path);
        //   fs.writeFileSync(fileName, fileContents);
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }


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


//   const repositoryUrl = 'https://github.com/sehmim/chatgpt-slackbot.git';
// const destinationPath = './repos/';

// cloneRepository(repositoryUrl, destinationPath)
//   .then(() => {
//     console.log('Repository cloned successfully!');
//   })
//   .catch((error) => {
//     console.error('Error:', error.message);
//   });


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

  function extractRepositoryName(url) {
    const parts = url.split('/');
    const repositoryWithGitExtension = parts[parts.length - 1];
    const repositoryName = repositoryWithGitExtension.replace('.git', '');
    return repositoryName;
  }