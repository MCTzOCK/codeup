/**
 * apps/web/src/pages/ide/project/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.07.2022
 *
 */

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import redirect from '@codeup/util/src/userworkflow/redirect';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  useDisclosure,
  useToast,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Heading,
  Center,
  Link,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverHeader,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import {
  FaCloudUploadAlt,
  FaCogs,
  FaCss3,
  FaEye,
  FaFile,
  FaFolderPlus,
  FaHtml5,
  FaJsSquare,
  FaMarkdown,
  FaPlus,
  FaTrash,
  FaUserFriends,
} from 'react-icons/fa';
import Editor, { Monaco, useMonaco } from '@monaco-editor/react';
import {
  FiEdit,
  FiEdit2,
  FiFilePlus,
  FiFolderPlus,
  FiTrash2,
} from 'react-icons/fi';

export default function Index() {
  const router = useRouter();
  const toast = useToast();

  const [editorOptions, setEditorOptions] = useState<{
    fontSize: number;
  }>({
    fontSize: 22,
  });

  const [currentFile, setCurrentFile] = useState<{
    path: string;
    content: string;
  } | null>(null);

  const {
    isOpen: isFileMenuOpen,
    onOpen: onFileMenuOpen,
    onClose: onFileMenuClose,
  } = useDisclosure();

  const [errorAlert, setErrorAlert] = useState<{
    show: boolean;
    error: string;
  }>({
    show: false,
    error: '',
  });

  const [project, setProject] = useState<{
    _id: string;
    owner: string;
    name: string;
    contributors: {
      user: string;
      permissions: string[];
    }[];
    files: {
      path: string;
      content: string;
    }[];
  } | null>(null);

  useEffect(() => {
    redirect({
      forceAnonymous: false,
      allowAnonymous: false,
      redirectTo: router.pathname,
      redirectToLogin: true,
    });
  }, [router]);

  useEffect(() => {
    if (router.query.id) {
      fetch('/api/ide/projects/' + router.query.id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
        }),
      }).then((res) => {
        res.json().then((data) => {
          if (res.status === 200) {
            setProject(data.project);
          } else {
            setErrorAlert({
              error: data.error,
              show: true,
            });
          }
        });
      });
    }
  }, [router]);

  const editorRef = useRef(null);
  const monaco = useMonaco();
  const [monacoTheme, setMonacoTheme] = useState('vs-dark');

  useEffect(() => {
    if (monaco && monaco.editor) {
      monaco.editor.defineTheme('codeup-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#171923',
        },
      });
      setMonacoTheme('codeup-dark');
    }
  }, [monaco]);

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (project && project._id) {
      fetch('/api/ide/projects/permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project: project._id,
          token: localStorage.getItem('token'),
        }),
      }).then((res) => {
        res.json().then((data) => {
          setPermissions(data.permissions);
        });
      });
    }
  }, [project]);

  return (
    <>
      {errorAlert.show ? (
        <Alert status="error" variant={'top-accent'}>
          <AlertIcon />
          <AlertTitle>Fehler!</AlertTitle>
          <AlertDescription>{errorAlert.error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <Flex
            direction={'row'}
            w={'100%'}
            minH={'100vh'}
            id={'editor-wrapper-flex'}
          >
            <Box
              flex={'5%'}
              minH={'90vh'}
              bgColor={'gray.900'}
              w={'100%'}
              margin={'2rem'}
              rounded={'xl'}
              shadow={'2xl'}
            >
              <Flex direction={'column'}>
                <Tooltip label={'Dateien'} placement={'right'} hasArrow>
                  <IconButton
                    aria-label={''}
                    variant="ghost"
                    size={'lg'}
                    p={'2rem'}
                    icon={<FaFile />}
                    rounded={'none'}
                    roundedTopLeft={'xl'}
                    roundedTopRight={'xl'}
                    onClick={onFileMenuOpen}
                  />
                </Tooltip>
                {permissions.includes('MANAGE-CONTRIBUTORS') ||
                permissions.includes('OWNER') ? (
                  <Tooltip label={'Mitwirkende'} placement={'right'} hasArrow>
                    <IconButton
                      aria-label={''}
                      variant="ghost"
                      size={'lg'}
                      p={'2rem'}
                      icon={<FaUserFriends />}
                      rounded={'none'}
                    />
                  </Tooltip>
                ) : null}
                <Tooltip label={'Veröffentlichen'} placement={'right'} hasArrow>
                  <IconButton
                    aria-label={''}
                    variant="ghost"
                    size={'lg'}
                    p={'2rem'}
                    icon={<FaCloudUploadAlt />}
                    rounded={'none'}
                  />
                </Tooltip>
                <Tooltip label={'Vorschau'} placement={'right'} hasArrow>
                  <IconButton
                    aria-label={''}
                    variant="ghost"
                    size={'lg'}
                    p={'2rem'}
                    icon={<FaEye />}
                    rounded={'none'}
                  />
                </Tooltip>
                <Tooltip label={'Einstellungen'} placement={'right'} hasArrow>
                  <IconButton
                    aria-label={''}
                    variant="ghost"
                    size={'lg'}
                    p={'2rem'}
                    icon={<FaCogs />}
                    rounded={'none'}
                  />
                </Tooltip>
              </Flex>
            </Box>
            <Box
              flex={'95%'}
              minH={'90vh'}
              bgColor={'gray.900'}
              w={'100%'}
              maxW={'100%'}
              margin={'2rem'}
              rounded={'xl'}
              shadow={'2xl'}
            >
              <Flex
                direction={'column'}
                w={'100%'}
                h={'100%'}
                p={'.6rem'}
                gap={'.4rem'}
              >
                {currentFile ? (
                  <>
                    <Box flex={'5%'}>
                      <ButtonGroup>
                        <Menu>
                          <MenuButton as={Button} variant={'ghost'}>
                            Datei
                          </MenuButton>
                          <MenuList backgroundColor={'gray.900'}>
                            {permissions.includes('WRITE') ||
                            permissions.includes('OWNER') ? (
                              <>
                                <MenuItem
                                  onClick={() => {
                                    fetch(
                                      '/api/ide/projects/' +
                                        project?._id +
                                        '/file/save?id=' +
                                        project?._id,
                                      {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                          token: localStorage.getItem('token'),
                                          path: currentFile?.path,
                                          content:
                                            // @ts-ignore
                                            editorRef?.current?.getValue(),
                                        }),
                                      }
                                    ).then((res) => {
                                      res.json().then((data) => {
                                        if (res.status === 200) {
                                          let f = project?.files;

                                          if (
                                            f &&
                                            f.find(
                                              (p) =>
                                                p.path ===
                                                (currentFile?.path as string)
                                            )
                                          ) {
                                            (
                                              f.find(
                                                (p) =>
                                                  p.path ===
                                                  (currentFile?.path as string)
                                              ) as {
                                                content: string;
                                                path: string;
                                              }
                                            ).content =
                                              // @ts-ignore
                                              editorRef?.current?.getValue();
                                          }

                                          if (project && f) {
                                            setProject({
                                              _id: project?._id,
                                              contributors:
                                                project?.contributors,
                                              owner: project?.owner,
                                              name: project?.name,
                                              files: f,
                                            });
                                          }

                                          toast({
                                            status: "success",
                                            variant: "solid",
                                            position: "top",
                                            title: "Erfolgreich",
                                            description: "Die Datei wurde erfolgreich gespeichert",
                                            isClosable: true,
                                            duration: 4000
                                          })
                                        } else {
                                          toast({
                                            status: 'error',
                                            variant: 'solid',
                                            position: 'top',
                                            title: 'Fehler',
                                            description: data.error,
                                            isClosable: true,
                                            duration: 4000,
                                          });
                                        }
                                      });
                                    });
                                  }}
                                >
                                  Speichern
                                </MenuItem>
                              </>
                            ) : null}
                            <MenuItem onClick={() => {
                              setCurrentFile(null)
                            }}>Schließen (OHNE SPEICHERN)</MenuItem>
                          </MenuList>
                        </Menu>
                        {permissions.includes('WRITE') ||
                        permissions.includes('OWNER') ? (
                          <>
                            <Menu>
                              <MenuButton as={Button} variant={'ghost'}>
                                Bearbeiten
                              </MenuButton>
                              <MenuList backgroundColor={'gray.900'}>
                                <MenuItem>Rückgängig</MenuItem>
                                <MenuItem>Wiederholen</MenuItem>
                                <MenuItem>Ausschneiden</MenuItem>
                                <MenuItem>Kopieren</MenuItem>
                                <MenuItem>Einfügen</MenuItem>
                                <MenuItem>Löschen</MenuItem>
                                <MenuItem>Suchen</MenuItem>
                              </MenuList>
                            </Menu>
                          </>
                        ) : null}
                        <Menu>
                          <MenuButton as={Button} variant={'ghost'}>
                            Hilfe
                          </MenuButton>
                          <MenuList backgroundColor={'gray.900'}>
                            <MenuItem>Über</MenuItem>
                            <MenuItem>Support</MenuItem>
                          </MenuList>
                        </Menu>
                      </ButtonGroup>
                    </Box>
                    <Box flex={'95%'}>
                      <Editor
                        defaultLanguage={
                          currentFile?.path.toLowerCase().endsWith('.js')
                            ? 'javascript'
                            : currentFile?.path.toLowerCase().endsWith('.html')
                            ? 'html'
                            : currentFile?.path.toLowerCase().endsWith('.css')
                            ? 'css'
                            : currentFile?.path.toLowerCase().endsWith('.md')
                            ? 'markdown'
                            : 'plain'
                        }
                        defaultValue={currentFile?.content}
                        onMount={handleEditorDidMount}
                        theme={monacoTheme}
                        options={{
                          fontSize: editorOptions.fontSize,
                          readOnly:
                            !permissions.includes('WRITE') &&
                            !permissions.includes('OWNER'),
                        }}
                      />
                    </Box>
                  </>
                ) : (
                  <>
                    <Center>
                      <Text
                        color="blue.500"
                        onClick={() => onFileMenuOpen()}
                        cursor="pointer"
                      >
                        Öffne eine Datei
                      </Text>
                      , damit du diese bearbeiten/lesen kannst.
                    </Center>
                  </>
                )}
              </Flex>
            </Box>
          </Flex>

          <Drawer
            isOpen={isFileMenuOpen}
            placement="left"
            onClose={onFileMenuClose}
            size={['full', 'lg']}
          >
            <DrawerOverlay />
            <DrawerContent bgColor={'gray.900'}>
              <DrawerCloseButton />
              <DrawerHeader>Dateien</DrawerHeader>

              <DrawerBody>
                <Flex direction={'column'} w="100%">
                  <Flex direction="row" w="100%">
                    <Box flex="90%"></Box>
                    <Box flex="10%">
                      {permissions.includes('WRITE') ||
                      permissions.includes('OWNER') ? (
                        <>
                          <ButtonGroup>
                            <Popover>
                              <PopoverTrigger>
                                <IconButton
                                  aria-label="Neue Datei"
                                  size="lg"
                                  fontSize={'2xl'}
                                  icon={<FiFilePlus />}
                                  variant="ghost"
                                />
                              </PopoverTrigger>
                              <PopoverContent bgColor="black">
                                <PopoverArrow bgColor="black" />
                                <PopoverCloseButton />
                                <PopoverHeader>Neue Datei</PopoverHeader>
                                <PopoverBody>
                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      let path =
                                        // @ts-ignore
                                        e.target.elements.newfilepath.value.toLowerCase();

                                      if (!path.startsWith('/')) {
                                        path = '/' + path;
                                      }

                                      if (
                                        project?.files.find(
                                          (f) => f.path === path
                                        )
                                      ) {
                                        toast({
                                          status: 'error',
                                          variant: 'solid',
                                          position: 'top',
                                          title: 'Fehler',
                                          description:
                                            'Diese Datei existiert bereits.',
                                          isClosable: true,
                                          duration: 4000,
                                        });
                                        return;
                                      }

                                      fetch(
                                        '/api/ide/projects/' +
                                          project?._id +
                                          '/file/save?id=' +
                                          project?._id,
                                        {
                                          method: 'POST',
                                          headers: {
                                            'Content-Type': 'application/json',
                                          },
                                          body: JSON.stringify({
                                            token:
                                              localStorage.getItem('token'),
                                            path,
                                            content: '0',
                                          }),
                                        }
                                      ).then((res) => {
                                        res.json().then((data) => {
                                          if (res.status === 200) {
                                            let f = project?.files;
                                            f?.push({
                                              path,
                                              content: '',
                                            });
                                            if (project && f) {
                                              setProject({
                                                _id: project?._id,
                                                contributors:
                                                  project?.contributors,
                                                owner: project?.owner,
                                                name: project?.name,
                                                files: f,
                                              });
                                            }
                                          } else {
                                            toast({
                                              status: 'error',
                                              variant: 'solid',
                                              position: 'top',
                                              title: 'Fehler',
                                              description: data.error,
                                              isClosable: true,
                                              duration: 4000,
                                            });
                                          }
                                        });
                                      });
                                    }}
                                  >
                                    <FormControl>
                                      <FormLabel>Pfad</FormLabel>
                                      <Input
                                        type="text"
                                        name="newfilepath"
                                        id="newfilepath"
                                        placeholder="Pfad"
                                      />
                                    </FormControl>
                                    <Button type="submit" mt=".6rem">
                                      Erstellen
                                    </Button>
                                  </form>
                                </PopoverBody>
                              </PopoverContent>
                            </Popover>
                          </ButtonGroup>
                        </>
                      ) : null}
                    </Box>
                  </Flex>
                  <Flex direction="column" maxH="90vh" overflow="auto">
                    {project?.files
                      .sort((a, b) => {
                        let x = a.path.toLowerCase();
                        let y = b.path.toLowerCase();
                        return x < y ? -1 : x > y ? 1 : 0;
                      })
                      .map((f) => {
                        return (
                          <Flex
                            direction="row"
                            p=".4rem"
                            cursor="pointer"
                            alignItems="center"
                            _hover={{
                              bgColor: 'gray.800',
                            }}
                          >
                            <Box flex="5%" fontSize="xl">
                              {f.path.toLowerCase().endsWith('.js') ? (
                                <FaJsSquare />
                              ) : f.path.toLowerCase().endsWith('.html') ? (
                                <FaHtml5 />
                              ) : f.path.toLowerCase().endsWith('.css') ? (
                                <FaCss3 />
                              ) : f.path.toLowerCase().endsWith('.md') ? (
                                <FaMarkdown />
                              ) : (
                                <FaFile />
                              )}
                            </Box>
                            <Box flex="20%">{f.path.substring(1)}</Box>
                            <Box flex="65%"></Box>
                            <Box flex="10%">
                              <ButtonGroup>
                                {permissions.includes('WRITE') ||
                                permissions.includes('OWNER') ? (
                                  <>
                                    <Tooltip label="Datei Löschen" hasArrow>
                                      <IconButton
                                        aria-label="Löschen"
                                        size="lg"
                                        fontSize={'xl'}
                                        icon={<FiTrash2 />}
                                        variant="ghost"
                                      />
                                    </Tooltip>
                                    <Tooltip label="Datei Umbenennen" hasArrow>
                                      <IconButton
                                        aria-label="Umbenennen"
                                        size="lg"
                                        fontSize={'xl'}
                                        icon={<FiEdit2 />}
                                        variant="ghost"
                                      />
                                    </Tooltip>
                                  </>
                                ) : null}

                                <Tooltip label="Bearbeiten" hasArrow>
                                  <IconButton
                                    aria-label="Bearbeiten"
                                    size="lg"
                                    fontSize={'xl'}
                                    icon={<FiEdit />}
                                    variant="ghost"
                                    onClick={() => {
                                      setCurrentFile({
                                        path: f.path,
                                        content: f.content,
                                      });
                                      onFileMenuClose();
                                    }}
                                  />
                                </Tooltip>
                              </ButtonGroup>
                            </Box>
                          </Flex>
                        );
                      })}
                  </Flex>
                </Flex>
              </DrawerBody>

              <DrawerFooter>
                <Button variant="outline" mr={3} onClick={onFileMenuClose}>
                  Schließen
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </>
  );
}
