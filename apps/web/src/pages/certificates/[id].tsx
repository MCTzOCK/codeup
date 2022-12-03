/**
 * apps/web/src/pages/certificates/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.11.2022
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import REST from "@codeup/rest";
import {
  Box,
  Flex,
  Heading,
  Text,
  useToast,
  chakra,
  ButtonGroup,
  Button,
  useDisclosure,
  Stack,
  Input,
  Image,
} from "@chakra-ui/react";
import CodeUpModal from "@codeup/components/codeup/CodeUpModal";
import { useLoggedIn } from "@codeup/hooks";

export default function CertViewer() {
  const router = useRouter();

  const { userInfo, loggedIn, loaded } = useLoggedIn();

  const { id } = router.query;

  const [steps, setSteps] = React.useState<any[]>([]);
  const toast = useToast();

  useEffect(() => {
    if (id && loggedIn && loaded) {
      REST.Certificates.getCertificate({
        token: localStorage.getItem("token") as string,
        onlyLookup: false,
        course: id as string,
      }).then((res) => {
        if (res.status === 200) {
          setSteps(res.payload.certificate.steps);
        } else {
          toast({
            title: "Fehler",
            description: "Das Zertifikat konnte nicht geladen werden.",
            status: "error",
            duration: 1500,
            isClosable: true,
            position: "bottom-right",
          });
        }
      });
    }
  }, [id, loggedIn, loaded]);

  useEffect(() => {
    if (loaded && !loggedIn) {
      router.push("/");
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
    }
  }, [userInfo, loggedIn, loaded]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentStep, setCurrentStep] = React.useState(0);

  const [answers, setAnswers] = React.useState<any[]>([]);

  const [finishButtonLoading, setFinishButtonLoading] = React.useState(false);

  React.useEffect(() => {
    console.log(answers);
  }, [answers]);

  return (
    <>
      <Flex
        w={"100%"}
        h={"100vh"}
        alignItems={"center"}
        justifyContent={"center"}
        direction={"column"}
      >
        <Box maxW={["90%", "30%"]}>
          <Heading as="h1" size="2xl" mt={8} textAlign={"center"}>
            Zertifikat
          </Heading>
          <Text fontSize="2xl" mt={8} textAlign={"center"}>
            Fülle die folgenden Schritte aus, um dein Zertifikat zu erhalten.
            <br />
            <chakra.span color={"red.400"} fontWeight={"bold"}>
              ACHTUNG:
            </chakra.span>
            &nbsp;Du kannst die Schritte nicht mehr bearbeiten, wenn du sie
            abgeschickt hast! Ein Zertifikat kannst du allerdings jederzeit
            erneut beantragen, um deine Punktzahl zu verbessern.
          </Text>
          <ButtonGroup
            mt={10}
            alignItems={"center"}
            justifyContent={"center"}
            w={"100%"}
          >
            <Button
              size={"lg"}
              colorScheme={"red"}
              variant={"outline"}
              onClick={() => {
                onOpen();
                setCurrentStep(0);
                setAnswers([]);
              }}
            >
              Zertifikat beantragen
            </Button>
          </ButtonGroup>
        </Box>
      </Flex>

      <CodeUpModal
        onOpen={onOpen}
        onClose={onClose}
        isOpen={isOpen}
        noCloseButton
        blackBackground={true}
        title={
          "Zertifikat beantragen (Schritt " +
          (currentStep === steps.length
            ? steps.length + "/" + steps.length + ")"
            : currentStep + 1 + "/" + steps.length + ")")
        }
        customSize={["full", "5xl"]}
      >
        <>
          {steps[currentStep] && (
            <>
              {steps[currentStep].step_type === "MULTIPLE_CHOICE" && (
                <>
                  <Heading as="h1" size="2xl" mt={8} textAlign={"center"}>
                    {steps[currentStep].multiple_choice.question}
                  </Heading>
                  <Stack mt={8}>
                    {steps[currentStep].multiple_choice.answers.map(
                      (a: any, i: any) => {
                        return (
                          <>
                            <Button
                              variant={"solid"}
                              onClick={() => {
                                setAnswers([
                                  ...answers,
                                  {
                                    step: currentStep,
                                    answer: i,
                                  },
                                ]);
                                setCurrentStep(currentStep + 1);
                              }}
                              rounded={"none"}
                            >
                              {a.answer}
                            </Button>
                          </>
                        );
                      }
                    )}
                  </Stack>
                </>
              )}
              {steps[currentStep].step_type === "TEXT" && (
                <>
                  <Heading size={"2xl"} textAlign={"center"} mt={8}>
                    {steps[currentStep].step_title}
                  </Heading>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;

                      const data = new FormData(form);

                      setAnswers([
                        ...answers,
                        {
                          step: currentStep,
                          ...Object.fromEntries(data),
                        },
                      ]);

                      setCurrentStep(currentStep + 1);
                    }}
                  >
                    {steps[currentStep].text_parts.map((t: any) => (
                      <>
                        {t.type === "TEXT" && (
                          <>
                            <Text mt={8} fontSize={"xl"}>
                              {t.value}
                            </Text>
                          </>
                        )}
                        {t.type === "INPUT" && (
                          <>
                            <Input mt={8} name={t.id} />
                          </>
                        )}
                      </>
                    ))}
                    <ButtonGroup w={"100%"} mt={8}>
                      <Button w={"100%"} colorScheme={"blue"} type={"submit"}>
                        Weiter
                      </Button>
                    </ButtonGroup>
                  </form>
                </>
              )}

              {steps[currentStep].step_type === "CODE_CHECK" && (
                <>
                  <Heading size={"2xl"} textAlign={"center"} mt={8}>
                    {steps[currentStep].step_title}
                  </Heading>
                  <Flex
                    direction={"column"}
                    w={"100%"}
                    h={"fit-content"}
                    paddingInline={10}
                    paddingBlock={5}
                    gap={40}
                  >
                    <Box flex={"100%"}>
                      <Stack>
                        <Heading>Ist der folgende Code richtig?</Heading>
                        <Image
                          src={steps[currentStep].code_check?.screenshot}
                          alt="Code Screenshot"
                        />
                      </Stack>
                    </Box>
                    <Box flex={"100%"}>
                      <form>
                        <ButtonGroup w={"100%"}>
                          <Button
                            w={"100%"}
                            colorScheme={"red"}
                            onClick={() => {
                              setAnswers([
                                ...answers,
                                {
                                  step: currentStep,
                                  answer: false,
                                },
                              ]);
                              setCurrentStep(currentStep + 1);
                            }}
                          >
                            Falsch
                          </Button>
                          <Button
                            w={"100%"}
                            colorScheme={"green"}
                            onClick={() => {
                              setAnswers([
                                ...answers,
                                {
                                  step: currentStep,
                                  answer: true,
                                },
                              ]);
                              setCurrentStep(currentStep + 1);
                            }}
                          >
                            Richtig
                          </Button>
                        </ButtonGroup>
                      </form>
                    </Box>
                  </Flex>
                </>
              )}
              {steps[currentStep].step_type === "CODE_COMPARE" && (
                <>
                  <Heading size={"2xl"} textAlign={"center"} mt={8}>
                    {steps[currentStep].step_title}
                  </Heading>
                  <Flex
                    direction={"column"}
                    w={"100%"}
                    h={"fit-content"}
                    paddingInline={10}
                    paddingBlock={5}
                    gap={40}
                  >
                    <Box flex={"100%"}>
                      <Stack>
                        <Heading>
                          Welcher der Codes bringt die gewünschte Ausgabe?
                        </Heading>
                        <Image
                          src={steps[currentStep].code_compare?.output}
                          alt="Output Image"
                        />
                      </Stack>
                      <Stack>
                        <Heading>Code 1</Heading>
                        <Image
                          src={
                            steps[currentStep].code_compare?.code_a.screenshot
                          }
                          alt="Code 1 Screenshot"
                        />
                        <Heading>Code 2</Heading>
                        <Image
                          src={
                            steps[currentStep].code_compare?.code_b.screenshot
                          }
                          alt="Code 2 Screenshot"
                        />
                      </Stack>
                    </Box>
                    <Box flex={"100%"}>
                      <form>
                        <ButtonGroup w={"100%"}>
                          <Button
                            w={"100%"}
                            colorScheme={"red"}
                            onClick={() => {
                              setAnswers([
                                ...answers,
                                {
                                  step: currentStep,
                                  answer: 0,
                                },
                              ]);
                              setCurrentStep(currentStep + 1);
                            }}
                          >
                            Code 1
                          </Button>
                          <Button
                            w={"100%"}
                            colorScheme={"green"}
                            onClick={() => {
                              setAnswers([
                                ...answers,
                                {
                                  step: currentStep,
                                  answer: 1,
                                },
                              ]);
                              setCurrentStep(currentStep + 1);
                            }}
                          >
                            Code 2
                          </Button>
                        </ButtonGroup>
                      </form>
                    </Box>
                  </Flex>
                </>
              )}
            </>
          )}
          {currentStep === steps.length && (
            <>
              <Heading as="h1" size="2xl" mt={8} textAlign={"center"}>
                Zertifikat beantragen
              </Heading>
              <Text fontSize="2xl" mt={8} textAlign={"center"}>
                Du hast alle Schritte abgeschlossen. Möchtest du das Zertifikat
                beantragen?
              </Text>
              <ButtonGroup
                mt={10}
                alignItems={"center"}
                justifyContent={"center"}
                w={"100%"}
              >
                <Button
                  size={"lg"}
                  colorScheme={"red"}
                  variant={"outline"}
                  isLoading={finishButtonLoading}
                  onClick={async () => {
                    setFinishButtonLoading(true);

                    const res = await REST.Certificates.submitCertificate({
                      token: localStorage.getItem("token") as string,
                      course: id as string,
                      answers,
                    });

                    if (res.status === 200) {
                      if (res.payload.obtainedCertificate) {
                        router.push(
                          "/user-cert/" + res.payload.obtainedCertificateId
                        );
                      } else {
                        router.push(
                          "/error?error=Du hast nicht genug Punkte für das Zertifikat erreicht."
                        );
                      }
                    } else {
                      setFinishButtonLoading(false);
                      toast({
                        title: "Fehler",
                        description:
                          "Beim Abschicken ist ein Fehler aufgetreten: " +
                          res.payload.error,
                        status: "error",
                        duration: 1500,
                        isClosable: true,
                        position: "bottom-right",
                      });
                    }
                  }}
                >
                  Zertifikat beantragen
                </Button>
              </ButtonGroup>
            </>
          )}
        </>
      </CodeUpModal>
    </>
  );
}
