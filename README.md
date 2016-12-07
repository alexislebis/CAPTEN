# CAPTEN

Web-based ecosystem, developed in **[Polymer](https://www.polymer-project.org/1.0/)**, concerning the Capitalization of Analysis Processes for Technology Enhanced learNing (CAPTEN).

Developed by **[A.Lebis](http://liris.cnrs.fr/~alebis)** under the **[Hubble project](http://hubblelearn.imag.fr/?lang=fr)** `ANR-14-CE24-0015`.


CAPTEN is a composition of several scientific works:

- Works on semantic creation of independent analysis processes (*IAP*): Semantic descriptor & designer (*SEED*)
- Works on relevant researches and browsing for IAP
- Works on the evolution of the semantic aspect of the e-learning vocabulary & ontology embeded in CAPTEN representing TEL terminologies
- Works on the inferences made in/by an IAP
- Works on the adaptability of an IAP
- Works on the implementation of IAP
- Works on the versioning of IAP/OI

These different works are strongly bound. For instance, in the elaboration of an IAP in CAPTEN-SEED, the system *MUST* infere information, the CAPTEN vocabularies and ontologies *MUST* evolve according to users.

## CAPTEN-TRY
CAPTEN-TRY, for *Capitalization of Analysis Processes for Technology Enhanced learNing - Test RepositorY* is a test subproject where different ideas and techno are tested for understanding. Since these elements are not developed with specific means, they cannot be integrated inside other CAPTEN declination.

## CAPTEN-SEED

CAPTEN-SEED, standing for *Capitalization of Analysis Processes for Technology Enhanced learNing - SEmantic dEscriptor & Designer*, allow the users to create and describe analysis processes used mainly in the TEL field under an independent formalism, ready for capitalization and sharing.

This formalism is based on relational vocabularies and ontologies.

### Documentation
See tutorials and examples for using CAPTEN-SEED for more information.

### Install
Please make sure that **[python](https://www.python.org/)**, **[git](https://git-scm.com/)** and **[bower](https://bower.io/)** is installed on your computer. If not, you can **[install](https://www.npmjs.com/package/bower)** it with **[NPM](https://www.npmjs.com/)**.


1. Download the CAPTEN project:
```bash
git clone https://github.com/alexislebis/CAPTEN.git
```
2. Then, run the bower_dependencies script in order to build all the dependencies in the different sub repositories:
```bash
./bower_dependencies.sh
```
3. [OPTIONAL]
If bower stalls while retrieving some dependencies and throws the following error:
`git ls-remote -tags --heads git://github.com/...`, please make sure that your git command is correctly configured to access github with the https protocol. You can do so with the following command line:
```
git config --global url."https://".insteadOf git://
```

4. CAPTEN-SEED rely on **[Polymer](https://www.polymer-project.org/1.0/)**. Thus, in order to render and use correctly the web project, you have to create an HTML server listening a specific port (here, the 3000).
```bash
cd ./SEED/
python -m SimpleHTTPServer 3000
```
5. Finally, open your web-browser at `http://localhost:3000/` (assuming that 3000 was the port used during the python command line).

## Thanks
[//]: # (I would like to thanks any contributors of the project. I would like to thanks especially **[Vanda Luengo](http://www.lip6.fr/actualite/personnes-fiche.php?ident=P1041)** and **[Nathalie Guin](http://liris.cnrs.fr/nathalie.guin/)** for their precious advices and helps.)

[//]: # (I am also truly thankful to **[Marie Lefevre](http://liris.cnrs.fr/marie.lefevre/index.html)** for her *unconditional* investments, helps and guidances *hrt*. Thank you. )
