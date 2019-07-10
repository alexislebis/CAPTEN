# CAPTEN

Web-based ecosystem, developed in **[Polymer](https://www.polymer-project.org/1.0/)**, concerning the Capitalization of Analysis Processes for Technology Enhanced learNing (CAPTEN).

Developed by **[A.Lebis](http://liris.cnrs.fr/~alebis)** under the **[Hubble project](http://hubblelearn.imag.fr/?lang=fr)** `ANR-14-CE24-0015`.


CAPTEN is a composition of several scientific works:

- Works on semantic creation of narrated analysis processes (*NAP*): Semantic descriptor & designer (*SEED*) (✓) 
- Works on relevant researches and browsing for NAP (WiP)
- Works on the evolution of the semantic aspect of the e-learning vocabulary & ontology embeded in CAPTEN, representing TEL terminologies (✓)
- Works on the inferences made in/by an NAP (x)
- Works on the adaptability of an NAP (WiP)
- Works on the implementation of NAP (WiP)
- Works on the versioning of NAP/NOP (x)

These different works are supposed to be strongly connected. For instance, one may want to track evolution in the elaboration of an NAP in CAPTEN-SEED. Therefore, the system *MUST* conserve information about the evolution of NAP/NOP and of CAPTEN's vocabularies and ontologies.

## CAPTEN-TRY
CAPTEN-TRY, for *Capitalization of Analysis Processes for Technology Enhanced learNing - Test RepositorY* is a test subproject where different ideas and technologies are tested. Since these elements are developed from an iterative perspective alongside our theory of capitalisation of analysis processes, it does not represents a final version. It a huge playground :)

## CAPTEN-SEED

CAPTEN-SEED, standing for *Capitalization of Analysis Processes for Technology Enhanced learNing - SEmantic dEscriptor & Designer*, allow the users to create and describe analysis processes used mainly in the TEL field under an independent formalism, ready for capitalization and sharing.

This formalism is based on relational vocabularies and ontologies.

It will be populated when the sub-part of TRY dealing with SEED will be judged stable and efficient.

### Documentation
See tutorials and examples for using CAPTEN-TRY for more information (on their way!).

## Install
We will work with CAPTEN-TRY for now.

Please make sure that **[python](https://www.python.org/)**, **[git](https://git-scm.com/)** and **[bower](https://bower.io/)** are installed on your computer. If not, you can **[install](https://www.npmjs.com/package/bower)** them with **[NPM](https://www.npmjs.com/)**.


1. Download the CAPTEN project:

  ```bash
  git clone https://github.com/alexislebis/CAPTEN.git
  ```

2. Retrieve and build the dependencies.

    2.2. [WINDOWS] Running `bower_dependencies.sh` script should not work. Build manually the bower file in the repository `./TRY` with `bower install`.

    2.1. [LINUX/MAC] Run the `bower_dependencies.sh` script in order to build all the dependencies in the different sub repositories:

  ```bash
  ./bower_dependencies.sh
  ```

3. [OPTIONAL] If bower stalls while retrieving some dependencies and throws the following error:
`git ls-remote -tags --heads git://github.com/...`, please make sure that your git command is correctly configured to access github with the https protocol. You can do so with the following command line:

  ```bash
  git config --global url."https://".insteadOf git://
  ```

4. CAPTEN-TRY rely on **[Polymer](https://www.polymer-project.org/1.0/)**. In order to render it, and to be correctly interpreted, you have to create an HTML server listening a specific port (here, the 3000).

  ```bash
  cd ./SEED/
  python -m SimpleHTTPServer 3000
  ```  

5. Finally, open your web-browser at `http://localhost:3000/` (assuming that 3000 was the port used during the python command line). CAPTEN should be loaded and ready to use.

### Note
CAPTEN does not embed predefined narrated operator, narrated analysis processes nor vocabularies, due to potential legal restrictions. Therefore, to populate your instance of CAPTEN, you can:
1. Populate it yourself manually;
2. Import a previous CAPTEN export (generally a `CAPTEN_EXPORT.json` file), made by you or someone else (there is no guaranty about the retrocompatibility of versions).

## License
<a rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/80x15.png" /></a><br />This work is licensed under a <a rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.

## Disclaimer
This research prototype is still in its early phase of development and faced several theorical iterations. This includes code design, optimisation and documentation. Despite all the efforts of the researcher, code refactorings requires huge amount of time and are not being considered for the moment :)

## Information
The master is not merged yet.
The last working branch of the project is the **[QRCodeHandler](https://github.com/alexislebis/CAPTEN/tree/qrcodeHandler)** based on the unmerged **[ASTROLABE](https://github.com/alexislebis/CAPTEN/tree/astrolabe)** branch too.
