# IBM i / AS400 Interview Questions — Master Question Bank

A consolidated, deduplicated collection of interview questions extracted from historical IBM i / AS400 interview notes. Questions are intentionally maintained as one continuous list without experience-level classification so this document can be extended over time.

**Source documents:** `faq-as400.doc` and `interview quest_as400.txt`. Additional independently rewritten question ideas were identified across the [Go4AS400 interview FAQ series](https://www.go4as400.com/as400-interview-questions-and-answers/FAQ.aspx?fid=1).

**Note:** Some questions concern legacy RPG/400, DDS, SDA, RLU, Query/400, or release-dependent limits. Their eventual answers should be validated against the relevant IBM i release and modern ILE RPG / Db2 for i capabilities.

**Total unique questions:** 764.

## Interview Questions

1. Define a shared access path?
2. What is the difference between array and a multiple occurrence data structure?
3. What is *INZSR used for?
4. How can you execute a command from within an RPG program without calling a CLP program?
5. What does the N operation extender mean when performing CHAIN or another RPG file operation?
6. Which RPG operations initialize a numeric field to zero, and why does moving blanks to a numeric field not produce the same result?
7. How can you check whether a record exists without retrieving its data using CHAIN or READ?
8. Define what a data area is along with a brief example of what it may be used for?
9. How can constants be defined and initialized in traditional RPG input specifications?
10. What is the difference between UDATE and the system date?
11. List some of the commonly used commands for debugging?
12. Define the RCVF command?
13. Define the purpose of the %SST function?
14. Describe the difference between the DOWxx and DOUxx operations?
15. Define the purpose of the LEAVE operation?
16. How would you copy records from one file to another when the target file might not exist and existing target records should be replaced?
17. How do you rename a record format in an RPG program when two files have the same record-format name?
18. What is the purpose of the /COPY compiler directive in an RPG program?
19. How do you associate a relative record number with a subfile record format in RPG?
20. How do you define and update a data-area data structure in an RPG program?
21. What is the purpose of the CSRLOC keyword in a display file?
22. What is the difference between SFLCLR and SFLINZ?
23. Define the purpose/use for SFLRNA?
24. How does an RPG CALL operation use a parameter list, result indicators, and error indicators?
25. What are the differences between READ, READE, READP, READC, and READPE?
26. How would you implement a loop that uses CHAIN, conditional program calls, and indicators in modern ILE RPG?
27. How do you set the keywords SFLSIZ and SFLPAG if you want the subfile to dynamically expand?
28. When should an expanding subfile be used, and when might a different subfile-loading strategy be preferable?
29. How can you detect and handle a record lock situation?
30. How can you detect overflow for a print program that prints multiple lines per cycle?
31. How would you design the process for a nightly, high volume check producing process that needs to select only records that are flagged to be processed?
32. How would you join 3 separate fields, a first name, middle initial and last name together as 1 field with proper spacing? You can describe in either RPG and/or RPG ILE (Integrated Language Environment)?
33. When PGMA calls PGMB for the first time PGMB executes the *INZSR. PGMB uses the RETRN operation to return to PGMA. When PGMA call PGMB the second time is the *INZSR executed?
34. Show 2 ways to convert a date from YYMMDD to MMDDYY (MULT operation not acceptable)?
35. What are Factor 1, the operation code, and resulting indicators used for in traditional RPG calculations?
36. Describe the function of SETLL operation in RPG language?
37. What is the purpose of Level Check parameter in a Physical file?
38. Define a Job Queue?
39. Define an output Queue?
40. What is the function of CPYSPLF command?
41. What is the function of CRTDUPOBJ command?
42. What are different types of subsystems?
43. Define a Batch Job?
44. Describe about Query/400?
45. What is the CLP command to access a Query/400?
46. What is the purpose of Overrides?
47. Define Data Structure?
48. List and explain the different type of data structures?
49. What is the purpose of DYNSLT keyword?
50. What is the difference between access path and Dynamic select?
51. Why would you prefer OPNQRYF than logical file?
52. What is the purpose of the keywords FIFO, LIFO, FCFO?
53. What is the difference between regular logical file and join logical file?
54. Distinguish between logical file and physical file?
55. What is field reference file?
56. What is the necessary keyword used in a physical file to refer field definitions from the field reference file?
57. What is the purpose of reorganizing the physical file i. e., RGZPFM?
58. What is the purpose of CHGPF (Change physical file) command?
59. What is the purpose of declarative statement DEFN?
60. What is the purpose of SFLNXTCHG keyword in a subfile?
61. What is the difference between Array and Table?
62. What are the different types of access paths maintained on the file?
63. How can you identify End of file in CLP program?
64. What is the difference between production library and test library?
65. What is message subfile?
66. What are necessary keywords to code message subfile?
67. What is the difference between SETON LR and RETRN?
68. When will you use OPEN and CLOSE opcodes in RPG program?
69. What is the difference between fully procedural file and primary file?
70. What is the difference between externally described file and program described file?
71. How many primary files allowed in a program?
72. How many secondary files allowed in a program?
73. What is the purpose of RTVMBRD command?
74. Define an Interactive Job?
75. How can you check the existence of object in a system?
76. What is the purpose of FRCDTA (Force Data) keyword?
77. What is the purpose of SFLFOLD and SFLDROP keywords?
78. What is the function of DSPATR (display attributes) keyword?
79. What is the purpose of PUTOVR (Put with explicit override) keyword?
80. What is the purpose of OVRDTA (Override Data) keyword?
81. What is the maximum number of record formats in DSPF?
82. What is the maximum number of fields under a record format of physical file?
83. What is the maximum number of parameters allowed in RPG?
84. What is the maximum number of subroutines allowed in RPG?
85. What is the maximum number of files allowed in RPG?
86. What is maximum number of Arrays allowed in RPG?
87. Where can you specify an indicator in LOKUP operation?
88. What is a Member?
89. What is a Physical file?
90. What is a Logical file?
91. What is Join Logical file?
92. What are the necessary keywords for the Join Logical file?
93. What is the necessary keyword for Non-join logical file?
94. How many levels are there in a Physical file?
95. What is the use of UNIQUE keyword and what level it is defined?
96. At what level S, O are defined and what they will do?
97. What is the difference between Packed decimal and Zoned decimal?
98. What is default data type (if you define decimals '0') in Physical file?
99. What is default data type for the fields(sub fields) defined in data structures in RPG?
100. Is it possible to create a physical file without DDS?
101. What is a Keyed physical file?
102. What is a composite key?
103. What is arrival sequence?
104. What is the maximum number of key fields allowed defining in a physical file?
105. What is acronym of RPG?
106. What is the native language of AS/400?
107. Why RPG/400 is famous?
108. How many specifications are there in RPG/400? What are they?
109. When do you use F-spec. continuation line?
110. What are the various types of device files?
111. When do you explicitly open files and close files in an RPG program?
112. How do you know that records are locked?
113. What is the purpose of Indicators in RPG?
114. How do you read data area in an RPG program?
115. What are the different types of Data Areas?
116. What are various techniques to pass parameters from one program to another?
117. Which single RPG opcode performs both SETLL and READE?
118. Why is AS/400 called Object Oriented Machine?
119. What is the version of OS/400 that we have?
120. What is DDM?
121. What is an Object?
122. How are the objects stored on AS/400?
123. What is a Library in AS/400?
124. Name few IBM supplied libraries?
125. What is library list?
126. How many libraries can be there in library list?
127. What is Folder?
128. What is Spool file, Why is it required?
129. What is Job, What are the attributes of a Job?
130. What is Job description?
131. What is the difference between Interactive and Batch Job?
132. What is Group Job?
133. What are the two main attributes, which govern the execution of a job?
134. What is subsystem?
135. What is a Device file?
136. What is an ICF file?
137. What is a message file?
138. What is a job log?
139. What is the purpose of OPNQRYF (Open Query File)?
140. How do you create files dynamically without DDS?
141. What command must be executed before executing OPNQRYF command?
142. What is Data Area?
143. What is LDA?
144. What is the type, length of a LDA?
145. What is GDA?
146. How do you create a user defined (general) data area?
147. What are the different ways to input data into data area?
148. How do you retrieve data from data area?
149. What are the valid user defined data area types?
150. How can a data area be locked after being updated?
151. What is the use of Data Queues?
152. How do you create a data queues?
153. What are the valid data types in Data Queue?
154. What are the two types of read performed on data queues?
155. How do you use DEBUG utility?
156. What is an authorization list?
157. How do you grant authority?
158. What are the types of object authorities?
159. How do you put jobs in batch mode?
160. What is the use of OVRDBF?
161. What is the use of OVRPRTF?
162. How do you change file attributes such as size, file wait time, record wait time etc., permanently?
163. What is the use purpose of CRTCMD?
164. How do you see active jobs of the system?
165. How do you detect unused spool storage?
166. What is journaling and Commitment Control?
167. What is the purpose of STRCMTCTL command?
168. What are the system objects required for journalling?
169. What are the different definition levels in Data Description Specifications?
170. What is the difference between Source Physical File and Physical File?
171. What is an access path?
172. What are all the different types of access path?
173. What is the default value for the number of increment for the physical file?
174. When does the DFT keyword in PF be used?
175. What is Multi-format logical file?
176. What is the Select and Omit criteria in logical file?
177. Can fields be concatenated INa logical file level?
178. When would the ALL keyword be used?
179. What are the different types of keywords in display files?
180. What is the maximum number of records you can specify in a display file?
181. How can a screen field that has changed since the last output operation be detected?
182. What would be the effect on the field where reverse image, underline and highlight display attributes were active?
183. What is the use of DSPATR(MDT) keyword?
184. If DSPATR(PC) and CSRLOC were specified for a format, which keyword would have priority?
185. Can error messages as a result of a COMP, RANGE or VALUES keyword be overridden?
186. What is the purpose of OVRDTA, OVRATA keywords?
187. How can a message from a message file appear as a constant on the screen?
188. In conjunction with what other keyword must OVRDTA and OVRATA be used?
189. What is the purpose of the INDARA keyword?
190. Explain the purpose of KEEP and ASSUME keywords?
191. Explain the use of DFTWRT display keyword?
192. What is the purpose of FRCDTA keyword?
193. What keyword must be used with PROTECT keyword?
194. What is subfile?
195. What are all the contents of subfile?
196. What are the two record formats a subfile contain?
197. What is SFLPAG and SFLSIZ?
198. What is the maximum number of subfiles that can be defined in a display file?
199. Maximum number of subfiles that can be active for a single file is?
200. Can more than one subfile record be displayed on one line?
201. How do you specify the number of records to roll in a subfile?
202. How will you display a particular page in subfile?
203. How do you pick up the changed records every time in a subfile after the first change made?
204. What is the use of SFLEND keyword?
205. How do you toggle between single line and Multi - line display of a particular record in a subfile?
206. Explain the difference between defining subfile and Message-subfile?
207. What are the different types of variables available in CL?
208. How do you pass parameters in CL?
209. What is the difference between CAT, TCAT, BCAT?
210. What are the different types of messages in CL?
211. How do you trap errors in CL?
212. What is the maximum length of a variable name in CL?
213. What are the limitations of CL (compare to RPG)?
214. What is the use of Header Specification in RPG/400?
215. When will DUMP and DEBUG opcodes be ignored?
216. What are Control level indicators?
217. What is the use of L specs in RPG?
218. In which specification the report layout can be defined?
219. How many files can be defined in F specs?
220. How many printer files can be defined in F specs?
221. Give three main purposes of File specification?
222. How do you specify page overflow indicator for printer files in RPG?
223. What is a Primary File?
224. Can a indexed file be accessed in arrival sequence in RPG program?
225. What is a Program Described file in RPG?
226. Can you specify a display file to be used in the following modes Input, Output, or Combined modes?
227. What is match field indicator?
228. What is the length of a variable in RPG?
229. When is a TAG statement used in RPG?
230. What opcode could be used to test an alphanumeric field for all numeric values?
231. What opcode will be used to test the zone of a character field?
232. How do you read database records without locking them?
233. What does CHECK opcode is used?
234. What does 'SR' in columns 7-8 of C specs mean?
235. What is SCAN and XLATE?
236. How do you use commitment control in RPG program?
237. How do you use exceptional write in C specs?
238. What does the opcode FREE do?
239. What does opcode POST do?
240. What is the maximum number of elements in an array?
241. Can we define Multi-dimensional arrays in RPG?
242. What is XFOOT opcode?
243. How can we sort an array?
244. How can the user implicitly open and close the files in RPG program?
245. What is File Information Data Structure?
246. What is Program Status Data Structure?
247. What is the maximum number of times Multiple Occurrences DS can occur in a program?
248. What are all the compiler directive statements?
249. How does the traditional RPG program cycle handle reading input, processing calculations, and writing output?
250. What is the Function of PDM?
251. What is the function of SEU?
252. What is the use of SDA?
253. What is the difference between Physical and Logical files?
254. What does the keyword UNIQUE mean?
255. What is FCFO, FIFO, LIFO in Database environment?
256. How many record formats can you have in a Physical file and in a Logical file?
257. What is keyword PFILE specifies?
258. What is a Join Logical File, Can it be used for Update?
259. Is it possible to join the same file to itself?
260. What does SDA stands for?
261. What is the symbol used for defining a new field in SDA?
262. What is the symbol used for shifting fields in SDA?
263. What is the symbol used for copying and moving new field in SDA?
264. What is the symbol used to get name and length of a field in SDA?
265. What is RPG?
266. What are the different types of specification available in RPG/400?
267. Is it necessary to define all formats? Which are mandatory and which are Optional?
268. In which specification Data Structures can be defined?
269. What are the different Opcodes available in RPG for Database access?
270. How can database records be read without lock?
271. In conjunction with which statements can ORxx and ANDxx conditions be used?
272. Can you have multiple key lists for a single file?
273. What are the different types of arrays available in RPG?
274. During input operation which indicator position is seton if there is a record lock?
275. What is the difference between *LIKE and *NAMVAR?
276. Where will control be passed after the execution of the *PSSR subroutine if the factor2 of the ENDSR is blank?
277. What are the different opcodes used for file operation on a subfile in a RPG program?
278. Can a single screen format occupy a screen area above and below a subfile format?
279. What are the three line types in RLU?
280. What is the function of RLU?
281. What are the three types of keywords associated with printer file?
282. How do you combine two record formats in RLU?
283. What are the different commands used in RLU?
284. What is the command used to invoke RLU?
285. What are different record spacing keywords in RLU?
286. Which DDS keywords are mandatory when defining a subfile?
287. What is the difference between the SFLRCDNBR and SFLNXTCHG keywords?
288. How can you identify the physical files used by a logical file and the logical files dependent on a physical file?
289. How can you determine the number of records in a database file?
290. How do you compile an RPGLE program?
291. Is an ILE module executable on its own?
292. What is procedure?
293. What is service program?
294. What is LOKUP opcode?
295. How many database files and printer files can be defined in a traditional RPG program?
296. How do you handle file exceptions and errors in an RPG program?
297. What are the OPNQRYF and MONMSG commands used for?
298. How do you set pointers to values 55 or next higher or greater?
299. How will I explicitly open a file in an RPG program?
300. Distinguish between terminating a program through SETON LR and RETURN?
301. How will you add a field to physical file already containing data?
302. What are the uses of FACTOR1, FACTOR2 and RESULT field for the RPG operation code PARM?
303. How will you find a string using PDM?
304. How will you search an array?
305. What are the different types of arrays?
306. What does DEFN do?
307. What are two types of record are used in subfile?
308. What are DDS required for subfile?
309. What is the difference between expandable and non-expandable subfiles?
310. What is SFLINZ and SFLRNA?
311. Can you display a empty subfile?
312. Why do we use READC? What is SFLNXTCHG?
313. How do you read changed records backward in subfile?
314. How you will find an error which is not in the first page of the subfile without using ROLLDOWN key?
315. What is SFLROLVAL?
316. How you will know whether you are in SFLDROP or SFLFOLD mode?
317. How you get the relative record in a subfile in which cursor is located?
318. What is QCMDEXC?
319. What is maximum size of data area?
320. How do you submit or start a batch job on IBM i?
321. How many levels of security are there on AS/400?
322. How do you translate field values form lower case to Upper case?
323. What are the maximum parameters can be passed from one RPG program to another RPG program?
324. How many maximum parameters can be passed from on RPG program to another CL program?
325. How many maximum arrays can be used in a single RPG program?
326. How many maximum printer files can be used in a single RPG program?
327. What is the maximum length of an OCCUR?
328. What is maximum size of a subfile?
329. How do you write and read a value (similarly as EXFMT of RPG) using a display file in CL?
330. How do you display a screen in CL?
331. How do you check end of file in CL?
332. Can you update a file in CL?
333. Can you add a record to a physical file through CL?
334. Which command submits a batch job, and why would you use it?
335. How do you monitor message in CL?
336. Except report design what else can be done by O spec?
337. What is the full for of CA and CF?
338. What is the difference between WRKUSRJOB and WRKACTJOB?
339. What are the three levels of SDA?
340. What is *PSSR?
341. Why do we define MOVE *ON *INLR?
342. How do you shutdown your IBM server?
343. If your workstation does not show login screen what might be the problem?
344. You have given a job for printing and you are not getting the printout what might be the reason?
345. There are multiple jobs for printing in job queue and you want to print a important document then what will you do?
346. How do you see the CPU usage?
347. Which Function key should be pressed to define hidden field while you are working with SDA?
348. Which function key should be pressed to watch all strings defined on the SDA screen?
349. While designing the screen using SDA, which function key should be pressed to get the field from the field reference file?
350. From work with member using PDM screen you have to modify existing member using SDA, which option do you select?
351. Which system-defined function displays the system name on a screen?
352. While designing the screen, F3 function key is kept common for all record formats. On which level should it be defined?
353. Write down any two mandatory keywords used when defining a subfile?
354. While designing the screen user wants to add file level keywords, then which function key should be pressed?
355. At what DDS level is the SFLRCDNBR keyword specified?
356. While designing the report using RLU, user wants to add record level keyword then which function key should be pressed?
357. If user wants to add one field on the report then which function key should be pressed?
358. SDA: After getting field reference from reference file selected files will appear at the bottom of the screen and then which command function will be used to get it on screen with its label to be left aligned?
359. If user wants to center the company name on his report then which line command will be used?
360. If user wants to change the length of the numeric field defined in report then which combination of keys will be used?
361. What is the difference between SKIPB(2) and SPACEB(2) in a printer file?
362. RLU: If user wants to define new numeric field on record format then which line command will be used?
363. What report-width limitations should be considered when designing reports with RLU?
364. To change constant field defined on RLU screen which field level keyword should be used?
365. RLU: Which field level keyword should be used to change any numeric field of length 8 to 99.99.9999 format?
366. At which DDS levels can the SPACE and SKIP printer keywords be specified?
367. How does SEU determine which syntax checking and prompting rules to apply?
368. Can Query/400 generate control-level or level-break reports?
369. Which physical-file operations can be performed using DFU?
370. What is the difference between normal UPDDTA to PF and updating using DFU program?
371. What is Library?
372. What types of libraries are used on IBM i?
373. What's the use of STRPDM?
374. In which Specs can PF be made internally?
375. What is the general syntax and naming convention of IBM i CL commands?
376. What is the difference between qualified and unqualified object names?
377. When should a program use qualified object names rather than relying on the library list?
378. How many types of files are available on AS/400?
379. How can you specify no duplicate key?
380. What is the command to know how many LF are related to a PF?
381. What is the command to know key fields of file?
382. What is the object type of PF, LF, Printer file and Display file?
383. How many types of display are available on AS/400 for user interaction?
384. Which is the Primary Editor of AS/400?
385. What are the basic features of SEU?
386. What are the different methods to access SEU?
387. Which are the member types which SEU supports?
388. In which Specs Arrays, Tables and Constants are defined?
389. What is a Spool File?
390. How many Specs are there in RPG and Which are they?
391. What is the difference between GOTO and EXSR in RPG?
392. What is the difference between command-attention and command-function keys?
393. What does EXFMT does?
394. How does the RUNQRY show the output?
395. When you are defining a flat file in your program in F Specs which format will you specify?
396. What is the difference between skip-before and space-before printer keywords?
397. Which indicator is used for Read?
398. Which are the figurative constants used in RPG?
399. What is the syntax for PLIST?
400. What are indicators?
401. What is CAB?
402. Which are the Relational Operators in RPG?
403. In 'O' Specs what is the opcode for write?
404. What is Subroutine in RPG?
405. Do we have to Execute the *INZSR compulsory?
406. What are the types of Tables in RPG?
407. What does LOKUP does in Tables and Arrays?
408. Which RPG operation codes are used to access database files?
409. What is RPG Fixed Logic Cycle?
410. How can we run a Batch Job?
411. What is the difference between CALL and SBMJOB?
412. What does VLDCMDKEY means?
413. What is the error if we don't get login screen?
414. How do you run other job when one job is active?
415. What are the practical uses of data structures in RPG?
416. What types of data structures are available in RPG?
417. Which is the subsystem that is always on till the main power switch is off?
418. What is the command to shutdown the AS/400 Server?
419. How can we know the CPU utilization of the server?
420. Which are the libraries (system) always present in the library list?
421. Which users are allowed to manipulate system libraries?
422. Can the objects stored in the product library be modified?
423. How many types of objects are there on AS/400?
424. How is data stored in PF's?
425. Give an example of DEFN opcode?
426. What is DBMS?
427. What are the types of Object Locks and what they do?
428. How do you place or remove locks on the objects?
429. Some of the object types on which locks can be allocated?
430. What is the opcode to release all the locks on a particular PF?
431. What is a trigger?
432. How many triggers can be associated with a single PF?
433. How can we know the triggers associated with the PF?
434. How can we add and remove trigger to a PF?
435. What does print writer do?
436. What are the 2 types of lines on O Specs?
437. Can a Subroutine contain another Subroutine?
438. Does the SETLL and SETGT retrieve the record?
439. What is a table?
440. What is a Compile Time Table?
441. What is a Run Time Table?
442. Give the Table definition?
443. If the data is likely to change over a period of time and Moreover data is large than which type of table is preferred?
444. What is Alternate Table?
445. What is an Array?
446. How do you write the qualified object name for a file named ORDPF in the TRAINING library?
447. What do members of a source physical file contain?
448. What do members of a logical file contain?
449. Do physical-file members contain application data?
450. What is the command to view the library list?
451. What is the command to create PF?
452. The LF is associated with how many PF's?
453. The function key to start SEU session through program development manager is?
454. The Member type for an RPG and CL program which SEU supports is?
455. What are printed output items placed in an output queue called?
456. Where is a newly created spooled file placed?
457. The command to display a list of spooled files?
458. Can changing an externally described file require dependent RPG programs to be recompiled?
459. Which command is used to display current library is?
460. A PF can have how many record formats?
461. How does IBM i determine object-search precedence among the current library and libraries in the library list?
462. What does WRKOBJ OBJ(*ALLUSR/DBTMEF) do?
463. How does SEU use source-member type for prompting and syntax checking?
464. Can a Query/400 query be executed using the RUNQRY command?
465. Can Query/400 produce level-break reports?
466. What record operations can be performed through DFU?
467. Write system defined function used to place system name on the screen?
468. What report-width limitations apply when designing a report using RLU?
469. Space and Skip are which level keywords?
470. A Join Logical File has how many Record formats?
471. A Multiple format Logical File is also known as?
472. How does Union file maintains Record formats?
473. What is full form for DDS?
474. What are members?
475. What is RPG, and how has the language evolved on IBM midrange systems?
476. For, which purpose is H Specs used?
477. What is the size of the filename in RPG?
478. Which are the different File Types in RPG?
479. What's the use of File Designation in RPG?
480. What is the use of File Format in RPG?
481. What is L Specs for?
482. How many maximum spaces could be given in O Specs?
483. Which are Control Break Logic indicators?
484. What are Data Structures?
485. Which are the four keywords supported by Program Status Data Structure?
486. Which are the String Manipulation Opcodes?
487. What type of database is Db2 for i?
488. What sequences can an IBM i database access path use?
489. Which file types support reading, updating, and deleting database records?
490. Which IBM i object types represent Db2 for i database objects?
491. What is SQL?
492. Which DDS keywords can be specified at the file level of a physical file?
493. Which command is used to create FRF?
494. Join Logical File displays data from how many files?
495. Can a Query/400 query be displayed or run without saving it?
496. Which are the Query selection criteria, which can be given in a Query?
497. To add a file to the 'File Selection' option of a Query, the function key to be pressed is?
498. In which execution modes can a Query/400 query be run?
499. What operations can a DFU program perform on a database record?
500. When are the Unique Constraints executed?
501. When are the Referential Constraints executed?
502. Why is the Declare cursor statement is used for?
503. What do we can do with the Embedded SQL statements?
504. What is the values SQLCOD when there is an error in fetching the records specified in the select statement?
505. Can a database file have more than one unique key or unique constraint?
506. Is DLCOBJ always required to release an object lock?
507. What is a Journal?
508. Which are the DB2 tools to protect Integrity of the database?
509. What is a host variable in an embedded SQL statement?
510. Which of the CL command can be used to determine which logical files are dependent on a specific file?
511. Which CL command is used to trap error messages during program execution?
512. Which CL command can be used at program execution to redirect the file named in an RPG program?
513. What default or explicit length applies to a character variable declared with DCL in CL?
514. Which CL command displays a screen and waits for Enter or a function key?
515. How would you override a database file for one called RPG program without affecting another program called later in the same CL job?
516. What is command to convert the date format in CL?
517. What is command to write or update to a database file in CL?
518. What is the command for retrieving user profile attributes?
519. What is the command to display the Data Area "Name"?
520. What is the command to submit the Batch Job?
521. What length and representation considerations apply when numeric parameters are passed through SBMJOB?
522. How can you determine or override the attributes of an output report?
523. Which command is used to retrieve attributes of a job?
524. How many files can a CL program declare, and how do the limits differ between traditional CL and modern ILE CL?
525. Command in CL to copy a Query to a database file?
526. Command CLOF stands for?
527. Command OPNQRYF stands for?
528. Command OVRDBF stands for?
529. Can you debug RPG III program with STRDBG?
530. Which of the following options describes the result of using the USROPN keyword?
531. How can externally described database-file fields be made available to an RPG program?
532. What does the %SUBST built-in function do in RPG?
533. How would you rewrite fixed-format RPG/400 logic in modern ILE RPG?
534. Which date formats can be specified using the DATFMT keyword?
535. What is the command invoked when we give option 14 to RPGLE program?
536. What happens if you attempt to debug an RPGLE program using STRISDB instead of an appropriate ILE debugger?
537. How do you define an RPGLE variable with the same attributes as an existing field?
538. The keyword used to define number of entries per record for Tables/Arrays in RPGLE is?
539. Which traditional RPG specifications are not used in the same way in ILE RPG?
540. Which is the Built in function to convert numeric field to Alpha field?
541. If user wants to retrieve the time in microseconds, what Would be data type of the field?
542. Can an RPG subprocedure use the traditional RPG program cycle?
543. What types of program and procedure calls does RPGLE support?
544. How many files can be opened in RPG IV program?
545. How do CHAIN, SETLL, SETGT, READE, and READPE report success, failure, or end-of-file conditions?
546. What does XFOOT, MOVEA and SORTA does?
547. What advantages does ILE RPG offer over traditional RPG/400?
548. What are the purposes of the SFL and SFLCTL record formats?
549. What are the subfile Types?
550. What is the difference between SFLCSRRRN and SFLRCDNBR?
551. What is SFLNXTCHG?
552. How do you use READC to retrieve changed records from a subfile?
553. Which DDS keywords are required to define and control a subfile?
554. What are PLIST and KLIST, and how do their purposes differ?
555. How do you position a database file or subfile to a particular record?
556. What is the difference between setting on LR and using RETURN in RPG?
557. What operations and modern alternatives can be used to manipulate RPG indicators?
558. Which RPG operation code updates an existing database record?
559. How do I insert a record into a database file?
560. What are two ways to delete a record from a database file in RPG?
561. How do you define a subroutine?
562. In a load-all subfile, are entered options preserved when the user pages down and then pages up?
563. How will you take care of multiple options in case subfile?
564. If we type some options on screen out of which some are invalid and pressed enter, what should happen?
565. How will you achieve POSITION TO in Load all subfile?
566. What are the built in function in RPGLE?
567. How do you print HEADER if O-specs are used in program?
568. How do you define an array in an RPG D-specification or modern free-form declaration?
569. What is *PSSR and INFSR?
570. How do you go to *PSSR?
571. Can we call *PSSR if no exception occurs? What happen it is called?
572. What is INFDS?
573. How do you determine if the record is in used by another user?
574. How do you write *PSSR?
575. What are a procedure prototype and a procedure interface, and how are they defined?
576. How do you define Global Parameter in ILE?
577. What is the disadvantage of using Global variable?
578. What is the structure of a service program, and what role does its signature play?
579. What is *ISO date format?
580. If we tried to move year part of *ISO date into a field of length 3, what will happen?
581. How do you avoid using indicators in ILE?
582. What is the difference between the EDTCDE and EDTWRD keywords?
583. What does the OVERLAY keyword do in a display file?
584. What key word is used when screen is re-display?
585. How do you validate input values in Display file?
586. Disadvantage of using Validity Check keyword? How to overcome these disadvantages?
587. What are the important factors in Error message subfile?
588. How do you define to define a Hidden field in DSPF?
589. How do you get the cursor position?
590. What is a stored procedure, and how do you define one on IBM i?
591. How would you select related records from two files using an SQL join and an SQL subquery?
592. How do you achieve referential integrity?
593. How can you identify where a stored procedure is defined and inspect its metadata on IBM i?
594. What is the difference between View and Index?
595. Can we have records (with fields from more than one file) from multiple files and Nested / sub query in SQL?
596. What is the sequence when using CURSOR?
597. What types of SQL cursors are available, and how do serial and scrollable cursors differ?
598. How do you call / invoke the stored procedure?
599. What are the two important parameter while creating a SQLRPGLE program?
600. Can we update database file with the help SQL Cursor?
601. Does Opening of cursor locks records?
602. What will happen if we call stored procedure again and again?
603. What is subsystem in AS/400?
604. What is JOBQ and PRINTQ?
605. How do you handle run time error in CL Program?
606. What is Data area and how it is used in RPG program?
607. Which program RPG or CL is efficient to update a transaction onto a database file and why?
608. How QTEMP is different from other libraries?
609. If a user signs on interactively and calls an RPG program that reads a file and creates a report, what type of job is running?
610. What is single level storage?
611. What is the difference between OPNQRYF and Logical file?
612. When would a data area be more appropriate than a database file for storing a small shared value?
613. What does STRSRVJOB command used for?
614. Which is the better option to write a transaction (order header and detail transaction) using two physical files or one join logical file(on those two physical files) in a program and why?
615. Can we have a multi record format join and non join logical file based on one physical file?
616. What is the difference between Multi record format Join and Non- Join logical file?
617. What is the difference between triggers and referential integrity?
618. Can a file be journaled without using it under commitment control?
619. What is the difference between module and program?
620. What is the difference between ILE RPG and RPG/400?
621. What are different types of Arrays and what is the difference between them?
622. What is a data structure? What are its uses?
623. What is Multi occurrence data structure?
624. What is the difference between SKIPA and SPACEA?
625. What is the difference between Command Function and Command Attention key?
626. What are different type of Sub files?
627. What is the difference between keyword SFLCSRRRN and RTNCSRLOC?
628. What is the difference between CHAIN and SETLL, and is there a performance advantage to either operation?
629. What are the different high-level languages available on AS/400?
630. What is the Operating System on AS/400?
631. What are the different types of Objects available in the AS/400?
632. Where is the system part of the library list stored?
633. What are the different Application Development Tools available on AS/400?
634. What is error severity?
635. What is a User Profile? What are the various classes?
636. What is Group Profile?
637. What are the different types of queues in AS/400?
638. How do you grant authority for an object?
639. How do you execute jobs in batch mode?
640. What is invocation stack?
641. What is time slice?
642. What is IPL?
643. Name the commands used to duplicate a file?
644. Name the command for changing the attributes of a spool file?
645. Name the command which gives the attributes of a job?
646. What is dynamic select?
647. How many files can be joined at a time, What is the maximum. number of files?
648. If a file layout is changed, how do you generate new PF and retain data?
649. What is the overhead on logical file? How can it be improved?
650. How can the sign of a numeric be ignored when sequencing a logical file?
651. If a field references a field that has an EDTCDE or an EDTWRD keyword specified, can the EDTCDE or EDTWRD from the referenced field ignored?
652. State three different methods of maintaining access paths?
653. How can a field that is larger than what could fit onto one line be truncated from the last blank rather than from the last character position?
654. Where is the variable for the SLNO(*VAR) keyword be defined?
655. Under what conditions would a field where the ERRMSG keyword was active would not be displayed in reverse image?
656. When will the message for field that has the ERRMSG keyword active not be displayed?
657. What is CHGINPDFT keyword, and what will be the effect if you define this keyword at file without any parameter values?
658. In what case control will be passed back to the program when the last character of the field is keyed?
659. How can a program be prevented from failing over when READC is performed on an empty subfile?
660. How do you start a CL program?
661. How many files can be declared in CL?
662. Which precedes, the file declaration or variable declaration?
663. Can libraries be added to the library list through CL?
664. How do you end a CL program?
665. How can errors be trapped in a CL program?
666. What are the positive points of RPG Language?
667. Explain RPG Program Logic Cycle?
668. When is it efficient to make use of RPG Cycle?
669. Can you call a program in your RPG program, which is coded in some other language?
670. What are the valid file types ( position 15 ) in F specification?
671. What are match fields indicators?
672. What are the different arithmetic Opcodes?
673. What is READP opcode?
674. How do you check if a division was whole division?
675. How do you specify Half Adjust?
676. Explain the difference between READ, CHAIN and SETLL?
677. What does LO and EQ indicators signify in READ, WRITE and CHAIN operations?
678. What is the difference between MOVE and MOVEL?
679. How do you concatenate two string variables in RPG?
680. What are the string operations possible in RPG/400?
681. What does SUBST do?
682. What is the difference between DOU and DOW?
683. What is ITER and LEAVE opcodes do?
684. Which instructions support structured programming in RPG?
685. Explain CASxx, and CABxx statements?
686. What is CLEAR and RESET?
687. What is the difference between WRITE and EXFMT of a display file?
688. What is the difference between PLIST and KLIST?
689. How do you specify data for a compile time array?
690. What is MOVEA opcode do?
691. How do you initialize an array?
692. Can LOKUP operation be used for unsorted array?
693. What is the maximum length of a table name?
694. What is the syntax of a table name?
695. What is the significance of DEFN opcode on RPG?
696. What are different ways by which you define working storage field?
697. How many parameters can be defined in a RPG program?
698. What are the different ways of ending an RPG program without a primary file?
699. Specify different ways by which RPG program can give error message to user?
700. If you are trying to add a record in a file and an error is displayed, where do you look for error?
701. How is embedded SQL used in RPG?
702. How can RPG program send message to System Operator?
703. Where DBCS data will be used in RPG?
704. How can the CPF error-id be retrieved when a program error occurs?
705. How could indicators 50 to 99 be set to '0' in one instruction?
706. What are the figurative constants?
707. What is the maximum error severity for which the compilation of RPG program stops?
708. What are the earlier versions of RPG?
709. Name the different ways by which RPG source program can be entered?
710. What is the record lock status value?
711. How do you split record formats in RLU?
712. How do you define overlapping fields in SDA?
713. To which member type does help text for panel belong?
714. What are the valid file operation codes for a PRINTER file?
715. If you use INDARA keyword for a program-described PRINTER file, what will be the result?
716. What is PRTCTL, and where will you define it?
717. Which option number is used to invoke RLU?
718. How do you pass numeric parameters for submit job?
719. What does the AS abbreviation represent in the historical AS/400 product name?
720. How does logical partitioning (LPAR) allow multiple independent environments to share IBM Power hardware?
721. What role does the QSYS library play in the IBM i object hierarchy?
722. When is QGPL used, and why should application objects generally be stored in dedicated libraries?
723. How can you display the objects in a library together with their storage sizes?
724. Which command options list every member belonging to a physical file?
725. How can you display the record-format definitions associated with a database file?
726. What precautions are necessary when changing the structure or record length of an existing physical file?
727. How do you create a physical file with multiple members and direct an application to a specific member?
728. How does the JDUPSEQ keyword determine which matching secondary-file record is selected in a join logical file?
729. What happens to unmatched primary records when JDFTVAL is specified on a join logical file?
730. What do the CPYF record-format mapping options control when source and target layouts differ?
731. When would you use CRTDUPOBJ instead of CPYF, and how do the resulting objects differ?
732. Which access sequence is used when a database file has no explicitly defined key?
733. How can source-change dates be reset within an SEU editing session?
734. How can you search source statements in SEU based on their change dates?
735. How can another source member be viewed alongside the current member in SEU?
736. How can an indicator data structure replace numbered display-file indicators with meaningful names?
737. What steps are required to create a subsystem description, attach a job queue, configure routing, and start the subsystem?
738. How is an FTP session initiated from IBM i, and which commands transfer files between systems?
739. How would you automate transferring a source member or database file between two IBM i environments?
740. How can FTP commands be scripted to download an IBM i source member to a local workstation?
741. How do FTP NAMEFMT 0 and NAMEFMT 1 differ in naming IBM i libraries, files, members, and IFS paths?
742. How can data be copied between an IBM i physical file and an IFS stream file?
743. What sequence of commands creates a journal receiver, creates a journal, and starts journaling a database file?
744. Which commands display journal entries, manage receivers, and stop journaling?
745. How do the ASSUME, OVERLAY, and KEEP display-file keywords interact when multiple screen formats remain visible?
746. How does FLDCSRPRG control the next input field selected when a user exits the current field?
747. How do SFLDROP, SFLFOLD, and SFLMODE control single-line and expanded subfile presentations?
748. What conditions can cause a workstation session or device error, and how should an RPG program recover?
749. How does the *NODEBUGIO option change stepping behavior during RPG debugging?
750. When should the IGNORE keyword exclude specific external record formats from an RPG file definition?
751. How can PREFIX prevent field-name collisions when multiple files expose identically named columns?
752. How can EXTMBR select a specific database-file member at runtime?
753. How does VARYING represent a variable-length character field in RPGLE?
754. When should the *VARSIZE parameter option be used, and what safeguards does it require?
755. How does EXTPGM map an RPG prototype to the external program object that will be called?
756. How do EXPORT and IMPORT share procedures or variables across ILE modules?
757. How does EXTPROC connect an RPG prototype to an exported external procedure?
758. How does EXTNAME populate a data structure from an externally described database record format?
759. How does CALLB invoke a bound procedure, and how does this differ from a dynamic program call?
760. How does CALLP invoke a prototyped procedure, and what parameter-checking benefits does it provide?
761. How does the EXCEPT operation produce exception output or printer-file records?
762. How do MONITOR and ON-ERROR handle runtime exceptions in an RPGLE statement group?
763. How does TEST validate date, time, or timestamp values before they are used?
764. What effect does the P operation extender have when MOVEL copies data into a larger target field?
</content>
