import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../styles/Footer.css'
import LinkedIn from '../assets/linkedinLogo.png'

function Footer() {
    
    

  return (
    <div className="footerDiv">
        <Container>
            <Row>
                <Col xs={6} md={4}>
                    <div className="linkedInImage">
                        <button id='buttonLinkedIn' onClick={event => window.location.href='https://linkedin.com/in/ariqchowdhury123'}><img src={LinkedIn} width={75} alt='linkedInLogo' /></button>
                    </div>
                    
                </Col>
                <Col xs={6} md={4}>
                    <a href='https://ariqgchowdhury.github.io/portfolio'>Website</a><br />
                    <a href='#'>About</a><br />
                    <a href='https://github.com/ariqgchowdhury'>Github</a>
                </Col>
                <Col xs={6} md={4}>
                    Contact me!<br />
                    ariq922@hotmail.com
                    
                </Col>
            </Row>
      
        </Container>
    </div>
    
  );
}

export default Footer;


